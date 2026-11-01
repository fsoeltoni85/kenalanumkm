export const CLAIM_PRICE_IDR = 20_000 as const;
export const CLAIM_CURRENCY = "IDR" as const;
export const PAYMENT_INTENT_TTL_MINUTES = 15 as const;
export const PAYMENT_INTENT_TTL_MICROSECONDS = 15n * 60n * 1_000_000n;

export type ClaimStatus = "pending_payment" | "expired" | "paid" | "cancelled";

export type ClaimPaymentIntent = {
  id: string;
  boardId: string;
  profileId: string;
  claimingUserId: string;
  profileOwnerUserId: string;
  businessContactVerified: boolean;
  paymentReference: string;
  amountIdr: typeof CLAIM_PRICE_IDR;
  currency: typeof CLAIM_CURRENCY;
  status: ClaimStatus;
  createdAt: string;
  expiresAt: string;
};

export type NewClaimPaymentIntent = Pick<
  ClaimPaymentIntent,
  | "id"
  | "boardId"
  | "profileId"
  | "claimingUserId"
  | "profileOwnerUserId"
  | "businessContactVerified"
  | "paymentReference"
  | "createdAt"
>;

export type VerifiedPaymentWebhook = {
  provider: string;
  eventId: string;
  transactionId: string;
  paymentReference: string;
  amountIdr: number;
  currency: string;
  signatureVerified: boolean;
  /** UTC timestamp captured by our server when the webhook reaches the endpoint. */
  receivedAt: string;
};

export type LeaderboardEntry = {
  boardId: string;
  profileId: string;
  position: number;
  lastClaimId: string;
  lastWebhookReceivedAt: string;
};

export type LeaderboardRankingState = {
  entries: LeaderboardEntry[];
  processedWebhookEventKeys: string[];
  processedTransactionKeys: string[];
  processedClaimIds: string[];
  unresolvedWebhookEventKeys: string[];
  duplicatePaymentEventKeys: string[];
};

export type ClaimRankingOutcome =
  | { status: "applied"; reason: "new_entry" | "profile_moved" | "entry_inserted_by_receipt_order" }
  | { status: "recorded_without_rank_change"; reason: "older_receipt_for_existing_profile" }
  | { status: "duplicate_event" }
  | { status: "duplicate_transaction" }
  | { status: "duplicate_claim_payment" }
  | { status: "late_payment_unresolved" }
  | { status: "ambiguous_order"; reason: "equal_webhook_receipt_timestamp" | "existing_board_timestamp_collision" }
  | {
      status: "rejected";
      reason:
        | "webhook_signature_not_verified"
        | "invalid_event_identity"
        | "invalid_claim_identity"
        | "profile_owner_mismatch"
        | "business_contact_not_verified"
        | "invalid_claim_price"
        | "invalid_payment_reference"
        | "invalid_payment_amount"
        | "invalid_payment_currency"
        | "invalid_claim_timestamps"
        | "claim_not_payable";
    };

export type ClaimRankingResult = {
  state: LeaderboardRankingState;
  outcome: ClaimRankingOutcome;
};

export const emptyLeaderboardRankingState = (): LeaderboardRankingState => ({
  entries: [],
  processedWebhookEventKeys: [],
  processedTransactionKeys: [],
  processedClaimIds: [],
  unresolvedWebhookEventKeys: [],
  duplicatePaymentEventKeys: [],
});

/**
 * Parses the canonical UTC format returned by the application/database boundary.
 * PostgreSQL receipt timestamps should be serialized as UTC ISO strings with at
 * most six fractional digits so microsecond ordering is not lost.
 */
function toEpochMicroseconds(value: string): bigint | null {
  const match = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d{1,6}))?Z$/.exec(value);
  if (!match) return null;

  const milliseconds = Date.parse(`${match[1]}Z`);
  if (!Number.isFinite(milliseconds)) return null;

  const canonicalSecond = new Date(milliseconds).toISOString().slice(0, 19);
  if (canonicalSecond !== match[1]) return null;

  const fractionalMicroseconds = Number((match[2] ?? "").padEnd(6, "0") || "0");
  return BigInt(milliseconds) * 1_000n + BigInt(fractionalMicroseconds);
}

function formatEpochMicroseconds(value: bigint): string {
  const wholeMilliseconds = value / 1_000n;
  const remainderMicroseconds = value % 1_000_000n;
  const base = new Date(Number(wholeMilliseconds)).toISOString().slice(0, 19);
  return `${base}.${remainderMicroseconds.toString().padStart(6, "0")}Z`;
}

/**
 * Creates a fixed-price claim intent. The browser must never supply the amount
 * or expiry; the server owns both values.
 */
export function createClaimPaymentIntent(input: NewClaimPaymentIntent): ClaimPaymentIntent {
  const createdAtMicros = toEpochMicroseconds(input.createdAt);
  if (createdAtMicros === null) {
    throw new Error("createdAt must be a valid UTC ISO timestamp with at most microsecond precision.");
  }

  return {
    ...input,
    amountIdr: CLAIM_PRICE_IDR,
    currency: CLAIM_CURRENCY,
    status: "pending_payment",
    expiresAt: formatEpochMicroseconds(createdAtMicros + PAYMENT_INTENT_TTL_MICROSECONDS),
  };
}

function withRecordedEvent(
  state: LeaderboardRankingState,
  webhookEventKey: string,
  transactionKey: string,
  extra: { unresolved?: boolean; duplicate?: boolean } = {},
): LeaderboardRankingState {
  return {
    ...state,
    processedWebhookEventKeys: [...state.processedWebhookEventKeys, webhookEventKey],
    processedTransactionKeys: [...state.processedTransactionKeys, transactionKey],
    unresolvedWebhookEventKeys: extra.unresolvedWebhookEventKeys
      ? [...extra.unresolvedWebhookEventKeys, webhookEventKey]
      : state.unresolvedWebhookEventKeys,
    duplicatePaymentEventKeys: extra.duplicatePaymentEventKeys
      ? [...extra.duplicatePaymentEventKeys, webhookEventKey]
      : state.duplicatePaymentEventKeys,
  };
}

function result(
  state: LeaderboardRankingState,
  outcome: ClaimRankingOutcome,
): ClaimRankingResult {
  return { state, outcome };
}

/**
 * Applies a provider-confirmed claim to exactly one board.
 *
 * Ordering is based only on the UTC webhook-received timestamp captured by our
 * server. Provider paid_at values are intentionally absent from this contract.
 * Receipt timestamps are compared at microsecond precision; equal timestamps
 * are surfaced as unresolved instead of inventing a tie-break rule. The claim
 * and verification state must be loaded by the server from trusted storage;
 * never accept these fields from a browser request.
 */
export function applyClaimPaymentWebhook(
  state: LeaderboardRankingState,
  claim: ClaimPaymentIntent,
  webhook: VerifiedPaymentWebhook,
): ClaimRankingResult {
  const provider = webhook.provider.trim().toLowerCase();
  const eventId = webhook.eventId.trim();
  const transactionId = webhook.transactionId.trim();
  const webhookEventKey = `${provider}:${eventId}`;
  const transactionKey = `${provider}:${transactionId}`;

  if (!provider || !eventId || !transactionId) {
    return result(state, { status: "rejected", reason: "invalid_event_identity" });
  }
  if (state.processedWebhookEventKeys.includes(webhookEventKey)) {
    return result(state, { status: "duplicate_event" });
  }
  if (state.processedTransactionKeys.includes(transactionKey)) {
    return result(
      withRecordedEvent(state, webhookEventKey, transactionKey, { duplicate: true }),
      { status: "duplicate_transaction" },
    );
  }
  if (!webhook.signatureVerified) {
    return result(state, { status: "rejected", reason: "webhook_signature_not_verified" });
  }
  if (
    !claim.id.trim()
    || !claim.boardId.trim()
    || !claim.profileId.trim()
    || !claim.claimingUserId.trim()
    || !claim.paymentReference.trim()
  ) {
    return result(state, { status: "rejected", reason: "invalid_claim_identity" });
  }
  if (claim.claimingUserId !== claim.profileOwnerUserId) {
    return result(state, { status: "rejected", reason: "profile_owner_mismatch" });
  }
  if (!claim.businessContactVerified) {
    return result(state, { status: "rejected", reason: "business_contact_not_verified" });
  }
  if (claim.amountIdr !== CLAIM_PRICE_IDR || claim.currency !== CLAIM_CURRENCY) {
    return result(state, { status: "rejected", reason: "invalid_claim_price" });
  }
  if (webhook.paymentReference !== claim.paymentReference) {
    return result(state, { status: "rejected", reason: "invalid_payment_reference" });
  }
  if (webhook.amountIdr !== CLAIM_PRICE_IDR) {
    return result(state, { status: "rejected", reason: "invalid_payment_amount" });
  }
  if (webhook.currency !== CLAIM_CURRENCY) {
    return result(state, { status: "rejected", reason: "invalid_payment_currency" });
  }

  const createdAt = toEpochMicroseconds(claim.createdAt);
  const expiresAt = toEpochMicroseconds(claim.expiresAt);
  const receivedAt = toEpochMicroseconds(webhook.receivedAt);
  if (
    createdAt === null
    || expiresAt === null
    || receivedAt === null
    || expiresAt - createdAt !== PAYMENT_INTENT_TTL_MICROSECONDS
    || receivedAt < createdAt
  ) {
    return result(state, { status: "rejected", reason: "invalid_claim_timestamps" });
  }

  if (claim.status === "cancelled" || claim.status === "paid") {
    return result(state, { status: "rejected", reason: "claim_not_payable" });
  }

  if (receivedAt >= expiresAt) {
    const nextState = withRecordedEvent(state, webhookEventKey, transactionKey, {
      unresolvedWebhookEventKeys: [],
    });
    return result(nextState, { status: "late_payment_unresolved" });
  }

  if (state.processedClaimIds.includes(claim.id)) {
    const nextState = withRecordedEvent(state, webhookEventKey, transactionKey, {
      duplicatePaymentEventKeys: [],
    });
    return result(nextState, { status: "duplicate_claim_payment" });
  }

  const boardEntries = state.entries.filter((entry) => entry.boardId === claim.boardId);
  const profileEntries = boardEntries.filter((entry) => entry.profileId === claim.profileId);
  if (profileEntries.length > 1) {
    return result(state, { status: "rejected", reason: "invalid_claim_identity" });
  }

  const entryTimestamps = boardEntries.map((entry) => toEpochMicroseconds(entry.lastWebhookReceivedAt));
  if (entryTimestamps.some((timestamp) => timestamp === null)) {
    return result(state, { status: "rejected", reason: "invalid_claim_timestamps" });
  }

  const timestampCounts = new Map<string, number>();
  for (const timestamp of entryTimestamps) {
    const key = timestamp?.toString() ?? "invalid";
    timestampCounts.set(key, (timestampCounts.get(key) ?? 0) + 1);
  }
  if ([...timestampCounts.values()].some((count) => count > 1)) {
    const nextState = withRecordedEvent(state, webhookEventKey, transactionKey, {
      unresolvedWebhookEventKeys: [],
    });
    return result(nextState, {
      status: "ambiguous_order",
      reason: "existing_board_timestamp_collision",
    });
  }

  const previousEntry = profileEntries[0];
  const previousTimestamp = previousEntry
    ? toEpochMicroseconds(previousEntry.lastWebhookReceivedAt)
    : null;

  if (previousEntry && previousTimestamp !== null && receivedAt <= previousTimestamp) {
    const nextState = {
      ...withRecordedEvent(state, webhookEventKey, transactionKey),
      processedClaimIds: [...state.processedClaimIds, claim.id],
    };
    return result(nextState, {
      status: "recorded_without_rank_change",
      reason: "older_receipt_for_existing_profile",
    });
  }

  if (entryTimestamps.some((timestamp) => timestamp === receivedAt)) {
    const nextState = withRecordedEvent(state, webhookEventKey, transactionKey, {
      unresolvedWebhookEventKeys: [],
    });
    return result(nextState, {
      status: "ambiguous_order",
      reason: "equal_webhook_receipt_timestamp",
    });
  }

  const updatedEntry: LeaderboardEntry = {
    boardId: claim.boardId,
    profileId: claim.profileId,
    position: 0,
    lastClaimId: claim.id,
    lastWebhookReceivedAt: webhook.receivedAt,
  };

  const candidates = previousEntry
    ? boardEntries.map((entry) => entry.profileId === claim.profileId ? updatedEntry : entry)
    : [...boardEntries, updatedEntry];

  const sortedEntries = [...candidates].sort((left, right) => {
    const leftTime = toEpochMicroseconds(left.lastWebhookReceivedAt);
    const rightTime = toEpochMicroseconds(right.lastWebhookReceivedAt);
    if (leftTime === null || rightTime === null) return 0;
    return leftTime === rightTime ? 0 : leftTime > rightTime ? -1 : 1;
  }).map((entry, index) => ({ ...entry, position: index + 1 }));

  const otherBoardEntries = state.entries.filter((entry) => entry.boardId !== claim.boardId);
  const nextState: LeaderboardRankingState = {
    ...withRecordedEvent(state, webhookEventKey, transactionKey),
    processedClaimIds: [...state.processedClaimIds, claim.id],
    entries: [...otherBoardEntries, ...sortedEntries],
  };

  const newPosition = sortedEntries.find((entry) => entry.profileId === claim.profileId)?.position;
  const outcome: ClaimRankingOutcome = !previousEntry
    ? (newPosition === 1
      ? { status: "applied", reason: "new_entry" }
      : { status: "applied", reason: "entry_inserted_by_receipt_order" })
    : { status: "applied", reason: "profile_moved" };

  return result(nextState, outcome);
}
