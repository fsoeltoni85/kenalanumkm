import { describe, expect, it } from "vitest";
import { GET } from "../app/api/health/route";

describe("KenalanUMKM health endpoint", () => {
  it("returns an ok status and the application identifier", async () => {
    const response = GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "ok",
      app: "kenalanumkm",
    });
  });
});
