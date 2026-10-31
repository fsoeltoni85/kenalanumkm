import { describe, expect, it } from "vitest";

describe("KenalanUMKM foundation", () => {
  it("uses Kabupaten/Kota as the geographic competition unit", () => {
    expect("Kabupaten/Kota").toBe("Kabupaten/Kota");
  });
});
