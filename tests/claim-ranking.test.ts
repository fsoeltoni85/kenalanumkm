import { describe, expect, it } from "vitest";
import {
  CLAIM_PRICE_IDR,
  PAYMENT_INTENT_TTL_MINUTES,
  applyClaimPaymentWebhook,
  createClaimPaymentIntent,
  emptyLeaderboardRankingState,
  type ClaimPaymentIntent,
  type LeaderboardEntry,
  type VerifiedPaymentWebhook,
} from "../app/lib/claim-ranking";

const claimInput = {
  id: "claim-1",
  boardId: "board-kota-bekasi",
  profileId: "profile-new",
  claimingUserId: "user-1",
  profileOwnerUserId: "user-1",
  businessContactVerified: true,
  paymentReference: "INV-UNIQUE-1",
  createdAt: "2026-11-01T10:00:00.000000Z",
};

function makeClaim(overrides: Partial<ClaimPaymentIntent> = {}): ClaimPaymentIntent {
  return {
    ...createClaimPaymentIntent(claimInput),
    ...overrides,
  };
}

function makeWebhook(overrides: Partial<VerifiedPaymentWebhook> = {}): VerifiedPaymentWebhook {
  return {
    provider: "provider-test",
    eventId: "evt-1",
    transactionId: "txn-1",
    paymentReference: "INV-UNIQUE-1",
    amountIdr: CLAIM_PRICE_IDR,
    currency: "IDR",
    signatureVerified: true,
    receivedAt: "2026-11-01T10:01:00.000100Z",
    ...overrides,
  };
}

function makeEntry(
  profileId: string,
  position: number,
  receivedAt: string,
  boardId = "board-kota-bekasi",
): LeaderboardEntry {
  return {
    boardId,
    profileId,
    position,
    lastClaimId: `claim-${profileId}`,
    lastWebhookReceivedAt: receivedAt,
  };
}

function positions(entries: LeaderboardEntry[], boardId: string) {
  return entries
    .filter((entry) => entry.boardId === boardId)
    .sort((left, right) => left.position - right.position)
    .map((entry) => [entry.profileId, entry.position]);
}

describe("claim payment intent", () => {
  it("uses the fixed all-in customer price and a server-defined 15-minute expiry", () => {
    const claim = createClaimPaymentIntent(claimInput);
    expect(claim.amountIdr).toBe(20_000);
    expect(claim.currency).toBe("IDR");
    expect(claim.status).toBe("pending_payment");
    expect(claim.expiresAt).toBe("2026-11-01T10:15:00.000000Z");
    expect(PAYMENT_INTENT_TTL_MINUTES).toBe(15);
  });
});

describe("independent leaderboard claim ordering", () => {
  it("inserts a new profile at #1 and shifts every existing entry down", () => {
    const state = {
      ...emptyLeaderboardRankingState(),
      entries: [
        makeEntry("profile-a", 1, "2026-11-01T10:00:00.000000Z"),
        makeEntry("profile-b", 2, "2026-11-01T09:59:00.000000Z"),
      ],
    };
    const result = applyClaimPaymentWebhook(state, makeClaim(), makeWebhook());

    expect(result.outcome).toEqual({ status: "applied", reason: "new_entry" });
    expect(positions(result.state.entries, "board-kota-bekasi")).toEqual([
      ["profile-new", 1],
      ["profile-a", 2],
      ["profile-b", 3],
    ]);
  });

  it("moves an existing profile to #1 while entries below its old position keep their ranks", () => {
    const state = {
      ...emptyLeaderboardRankingState(),
      entries: [
        makeEntry("profile-a", 1, "2026-11-01T10:00:00.000000Z"),
        makeEntry("profile-b", 2, "2026-11-01T09:59:00.000000Z"),
        makeEntry("profile-c", 3, "2026-11-01T09:58:00.000000Z"),
        makeEntry("profile-d", 4, "2026-11-01T09:57:00.000000Z"),
        makeEntry("profile-e", 5, "2026-11-01T09:56:00.000000Z"),
      ],
    };
    const result = applyClaimPaymentWebhook(
      state,
      makeClaim({ profileId: "profile-c" }),
      makeWebhook({ eventId: "evt-reclaim", transactionId: "txn-reclaim", receivedAt: "2026-11-01T10:01:00.000100Z" }),
    );

    expect(result.outcome).toEqual({ status: "applied", reason: "profile_moved" });
    expect(positions(result.state.entries, "board-kota-bekasi")).toEqual([
      ["profile-c", 1],
      ["profile-a", 2],
      ["profile-b", 3],
      ["profile-d", 4],
      ["profile-e", 5],
    ]);
  });

  it("does not create duplicate rows when the same profile claims the same board again", () => {
    const state = {
      ...emptyLeaderboardRankingState(),
      entries: [makeEntry("profile-new", 1, "2026-11-01T10:00:00.000000Z")],
    };
    const result = applyClaimPaymentWebhook(
      state,
      makeClaim(),
      makeWebhook({ eventId: "evt-2", transactionId: "txn-2", receivedAt: "2026-11-01T10:02:00.000100Z" }),
    );

    expect(result.state.entries.filter((entry) => entry.boardId === "board-kota-bekasi" && entry.profileId === "profile-new")).toHaveLength(1);
    expect(result.state.entries[0]).toMatchObject({
      profileId: "profile-new",
      position: 1,
      lastClaimId: "claim-1",
    });
  });

  it("changes exactly one board and leaves the same profile's other board entries untouched", () => {
    const nationalEntry = makeEntry(
      "profile-new",
      2,
      "2026-11-01T09:59:00.000000Z",
      "board-indonesia",
    );
    const state = {
      ...emptyLeaderboardRankingState(),
      entries: [
        makeEntry("profile-a", 1, "2026-11-01T10:00:00.000000Z"),
        nationalEntry,
      ],
    };
    const result = applyClaimPaymentWebhook(
      state,
      makeClaim(),
      makeWebhook(),
    );

    expect(positions(result.state.entries, "board-kota-bekasi")).toEqual([
      ["profile-new", 1],
      ["profile-a", 2],
    ]);
    expect(result.state.entries.find((entry) => entry.boardId === "board-indonesia")).toEqual(nationalEntry);
  });

  it("allows a selected board unrelated to the profile's descriptive location", () => {
    const claim = makeClaim({ boardId: "board-provinsi-papua-barat" });
    const result = applyClaimPaymentWebhook(
      emptyLeaderboardRankingState(),
      claim,
      makeWebhook(),
    );

    expect(result.outcome.status).toBe("applied");
    expect(result.state.entries[0].boardId).toBe("board-provinsi-papua-barat");
  });

  it("uses webhook receipt time rather than provider paid_at chronology", () => {
    const result = applyClaimPaymentWebhook(
      emptyLeaderboardRankingState(),
      makeClaim(),
      makeWebhook({
        receivedAt: "2026-11-01T10:01:00.000100Z",
        providerPaidAt: "2026-11-01T09:00:00.000000Z",
      } as VerifiedPaymentWebhook & { providerPaidAt: string }),
    );

    expect(result.state.entries[0].lastWebhookReceivedAt).toBe("2026-11-01T10:01:00.000100Z");
  });

  it("places an earlier-received event behind a later-received claim even when it is processed later", () => {
    const state = {
      ...emptyLeaderboardRankingState(),
      entries: [
        makeEntry("profile-newer", 1, "2026-11-01T10:02:00.000100Z"),
        makeEntry("profile-older", 2, "2026-11-01T10:01:00.000100Z"),
      ],
    };
    const result = applyClaimPaymentWebhook(
      state,
      makeClaim(),
      makeWebhook({ receivedAt: "2026-11-01T10:00:00.000100Z" }),
    );

    expect(result.outcome).toEqual({
      status: "applied",
      reason: "entry_inserted_by_receipt_order",
    });
    expect(positions(result.state.entries, "board-kota-bekasi")).toEqual([
      ["profile-newer", 1],
      ["profile-older", 2],
      ["profile-new", 3],
    ]);
  });
  it("inserts an out-of-order event between entries using its webhook receipt time", () => {
    const state = {
      ...emptyLeaderboardRankingState(),
      entries: [
        makeEntry("profile-newer", 1, "2026-11-01T10:02:00.000100Z"),
        makeEntry("profile-older", 2, "2026-11-01T10:01:00.000100Z"),
      ],
    };
    const result = applyClaimPaymentWebhook(
      state,
      makeClaim(),
      makeWebhook({ receivedAt: "2026-11-01T10:01:30.000100Z" }),
    );

    expect(positions(result.state.entries, "board-kota-bekasi")).toEqual([
      ["profile-newer", 1],
      ["profile-new", 2],
      ["profile-older", 3],
    ]);
  });

  it("does not let a delayed, earlier webhook replace a newer claim for the same profile", () => {
    const state = {
      ...emptyLeaderboardRankingState(),
      entries: [makeEntry("profile-new", 1, "2026-11-01T10:03:00.000100Z")],
    };
    const result = applyClaimPaymentWebhook(
      state,
      makeClaim(),
      makeWebhook({ receivedAt: "2026-11-01T10:01:00.000100Z" }),
    );

    expect(result.outcome).toEqual({
      status: "recorded_without_rank_change",
      reason: "older_receipt_for_existing_profile",
    });
    expect(result.state.entries).toEqual(state.entries);
    expect(result.state.processedClaimIds).toContain("claim-1");
  });

  it("allows the same saved profile to claim a second board independently", () => {
    const cityClaim = makeClaim();
    const cityResult = applyClaimPaymentWebhook(
      emptyLeaderboardRankingState(),
      cityClaim,
      makeWebhook(),
    );
    const provinceClaim = makeClaim({
      id: "claim-province",
      boardId: "board-provinsi-jawa-barat",
      paymentReference: "INV-PROVINCE",
    });
    const provinceResult = applyClaimPaymentWebhook(
      cityResult.state,
      provinceClaim,
      makeWebhook({
        eventId: "evt-province",
        transactionId: "txn-province",
        paymentReference: "INV-PROVINCE",
        receivedAt: "2026-11-01T10:02:00.000100Z",
      }),
    );

    expect(provinceResult.state.entries.filter((entry) => entry.profileId === "profile-new")).toHaveLength(2);
    expect(positions(provinceResult.state.entries, "board-kota-bekasi")).toEqual([["profile-new", 1]]);
    expect(positions(provinceResult.state.entries, "board-provinsi-jawa-barat")).toEqual([["profile-new", 1]]);
  });

  it("allows different profile IDs for the same real-world business on one board", () => {
    const state = {
      ...emptyLeaderboardRankingState(),
      entries: [makeEntry("profile-created-by-account-a", 1, "2026-11-01T10:00:00.000000Z")],
    };
    const result = applyClaimPaymentWebhook(
      state,
      makeClaim({ profileId: "profile-created-by-account-b" }),
      makeWebhook(),
    );

    expect(result.outcome.status).toBe("applied");
    expect(result.state.entries.filter((entry) => entry.boardId === "board-kota-bekasi")).toHaveLength(2);
  });

  it("treats equivalent UTC timestamp spellings as an identical microsecond", () => {
    const state = {
      ...emptyLeaderboardRankingState(),
      entries: [makeEntry("profile-a", 1, "2026-11-01T10:00:00.1Z")],
    };
    const result = applyClaimPaymentWebhook(
      state,
      makeClaim(),
      makeWebhook({ receivedAt: "2026-11-01T10:00:00.100000Z" }),
    );

    expect(result.outcome).toEqual({
      status: "ambiguous_order",
      reason: "equal_webhook_receipt_timestamp",
    });
  });

  it("records a successful latest claim even when the profile was already #1", () => {
    const state = {
      ...emptyLeaderboardRankingState(),
      entries: [makeEntry("profile-new", 1, "2026-11-01T10:00:00.000000Z")],
    };
    const result = applyClaimPaymentWebhook(
      state,
      makeClaim(),
      makeWebhook({ receivedAt: "2026-11-01T10:02:00.000100Z" }),
    );

    expect(result.outcome).toEqual({ status: "applied", reason: "profile_moved" });
    expect(result.state.entries[0]).toMatchObject({
      profileId: "profile-new",
      position: 1,
      lastClaimId: "claim-1",
    });
  });

});

  it("rejects an unauthenticated webhook before it can consume a transaction identity", () => {
    const state = {
      ...emptyLeaderboardRankingState(),
      processedTransactionKeys: ["provider-test:txn-1"],
    };
    const result = applyClaimPaymentWebhook(
      state,
      makeClaim(),
      makeWebhook({ eventId: "evt-forged", signatureVerified: false }),
    );

    expect(result.outcome).toEqual({
      status: "rejected",
      reason: "webhook_signature_not_verified",
    });
    expect(result.state).toEqual(state);
    expect(result.state.processedWebhookEventKeys).toHaveLength(0);
    expect(result.state.duplicatePaymentEventKeys).toHaveLength(0);
  });

  it("treats equal receipt time on a repeat claim as ambiguous", () => {
    const state = {
      ...emptyLeaderboardRankingState(),
      entries: [makeEntry("profile-new", 1, "2026-11-01T10:01:00.000100Z")],
    };
    const result = applyClaimPaymentWebhook(
      state,
      makeClaim(),
      makeWebhook({ receivedAt: "2026-11-01T10:01:00.000100Z" }),
    );

    expect(result.outcome).toEqual({
      status: "ambiguous_order",
      reason: "equal_webhook_receipt_timestamp",
    });
    expect(result.state.entries).toEqual(state.entries);
    expect(result.state.unresolvedWebhookEventKeys).toContain("provider-test:evt-1");
  });

describe("payment validation and unresolved cases", () => {
  it("is idempotent for a repeated webhook event", () => {
    const first = applyClaimPaymentWebhook(
      emptyLeaderboardRankingState(),
      makeClaim(),
      makeWebhook(),
    );
    const repeated = applyClaimPaymentWebhook(first.state, makeClaim(), makeWebhook());

    expect(repeated.outcome.status).toBe("duplicate_event");
    expect(repeated.state.entries).toEqual(first.state.entries);
  });

  it("does not apply a second transaction identity to the same claim", () => {
    const first = applyClaimPaymentWebhook(emptyLeaderboardRankingState(), makeClaim(), makeWebhook());
    const repeated = applyClaimPaymentWebhook(
      first.state,
      makeClaim(),
      makeWebhook({ eventId: "evt-other", transactionId: "txn-other" }),
    );

    expect(repeated.outcome.status).toBe("duplicate_claim_payment");
    expect(repeated.state.entries).toEqual(first.state.entries);
    expect(repeated.state.duplicatePaymentEventKeys).toContain("provider-test:evt-other");
  });

  it("rejects an unverified webhook", () => {
    const result = applyClaimPaymentWebhook(
      emptyLeaderboardRankingState(),
      makeClaim(),
      makeWebhook({ signatureVerified: false }),
    );
    expect(result.outcome).toEqual({ status: "rejected", reason: "webhook_signature_not_verified" });
    expect(result.state.entries).toHaveLength(0);
  });

  it("rejects amount-only or mismatched-reference payment matching", () => {
    const wrongReference = applyClaimPaymentWebhook(
      emptyLeaderboardRankingState(),
      makeClaim(),
      makeWebhook({ paymentReference: "SOME-OTHER-INVOICE" }),
    );
    const wrongAmount = applyClaimPaymentWebhook(
      emptyLeaderboardRankingState(),
      makeClaim(),
      makeWebhook({ amountIdr: 19_999 }),
    );

    expect(wrongReference.outcome).toEqual({ status: "rejected", reason: "invalid_payment_reference" });
    expect(wrongAmount.outcome).toEqual({ status: "rejected", reason: "invalid_payment_amount" });
  });

  it("rejects a claim not owned by the authenticated claimant", () => {
    const result = applyClaimPaymentWebhook(
      emptyLeaderboardRankingState(),
      makeClaim({ profileOwnerUserId: "another-user" }),
      makeWebhook(),
    );
    expect(result.outcome).toEqual({ status: "rejected", reason: "profile_owner_mismatch" });
  });

  it("requires the UMKM business-contact channel to be verified before a claim can rank", () => {
    const result = applyClaimPaymentWebhook(
      emptyLeaderboardRankingState(),
      makeClaim({ businessContactVerified: false }),
      makeWebhook(),
    );
    expect(result.outcome).toEqual({ status: "rejected", reason: "business_contact_not_verified" });
  });

  it("records a payment after the 15-minute expiry as unresolved and does not rank it", () => {
    const result = applyClaimPaymentWebhook(
      emptyLeaderboardRankingState(),
      makeClaim(),
      makeWebhook({ receivedAt: "2026-11-01T10:15:00.000000Z" }),
    );

    expect(result.outcome.status).toBe("late_payment_unresolved");
    expect(result.state.entries).toHaveLength(0);
    expect(result.state.unresolvedWebhookEventKeys).toContain("provider-test:evt-1");
  });

  it("does not invent an ordering when two valid webhook receipt timestamps are equal", () => {
    const state = {
      ...emptyLeaderboardRankingState(),
      entries: [makeEntry("profile-a", 1, "2026-11-01T10:00:00.000100Z")],
    };
    const result = applyClaimPaymentWebhook(
      state,
      makeClaim(),
      makeWebhook({ receivedAt: "2026-11-01T10:00:00.000100Z" }),
    );

    expect(result.outcome).toEqual({
      status: "ambiguous_order",
      reason: "equal_webhook_receipt_timestamp",
    });
    expect(result.state.entries).toEqual(state.entries);
    expect(result.state.unresolvedWebhookEventKeys).toContain("provider-test:evt-1");
  });
});
