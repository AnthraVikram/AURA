import { parseChat } from "../../src/chat/parseChat";

test("parses Swiggy 200", () => {
  const r = parseChat("Swiggy 200");
  expect(r.kind).toBe("intent");
  if (r.kind === "intent") {
    expect(r.type).toBe("expense.add");
    expect(r.payload.amount).toBe(200);
    expect(String(r.payload.description).toLowerCase()).toContain("swiggy");
    expect(r.payload.category).toBe("food");
  }
});

test("parses Coffee 80", () => {
  const r = parseChat("Coffee 80");
  expect(r.kind).toBe("intent");
  if (r.kind === "intent") {
    expect(r.payload.amount).toBe(80);
    expect(r.payload.category).toBe("food");
  }
});

test("parses Log ₹200 for Swiggy", () => {
  const r = parseChat("Log ₹200 for Swiggy");
  expect(r.kind).toBe("intent");
  if (r.kind === "intent") {
    expect(r.payload.amount).toBe(200);
    expect(String(r.payload.description).toLowerCase()).toContain("swiggy");
  }
});

test("missing amount clarifies", () => {
  const r = parseChat("Snacks");
  expect(r.kind).toBe("clarify");
});
