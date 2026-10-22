import catalogue from "../../src/data/learningResources.json";

test("catalogue items are curated https with honest certificates", () => {
  expect(catalogue.length).toBeGreaterThan(0);
  for (const item of catalogue) {
    expect(item.curated).toBe(true);
    expect(item.url.startsWith("https://")).toBe(true);
    if (item.kind === "youtube") {
      expect(item.url.includes("youtube.com") || item.url.includes("youtu.be")).toBe(true);
    }
  }
  expect(catalogue.some((i) => i.claimsCertificate)).toBe(true);
  expect(catalogue.filter((i) => i.id === "khan-academy")[0].claimsCertificate).toBe(false);
});
