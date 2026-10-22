import { CARDIO_TYPES, GYM_TYPES, validateIntAtLeast, validatePositiveNumber } from "../../src/domain/healthValidation";

test("workout and cardio types", () => {
  expect(GYM_TYPES).toContain("shoulders");
  expect(CARDIO_TYPES).toEqual(["running", "skipping"]);
});

test("sets reps duration weight", () => {
  expect(validateIntAtLeast(3, 1, "Sets")).toBeNull();
  expect(validateIntAtLeast(0, 1, "Sets")).toBeTruthy();
  expect(validatePositiveNumber(20, "Duration")).toBeNull();
  expect(validatePositiveNumber(0, "Duration")).toBeTruthy();
  expect(validatePositiveNumber(40, "Weight", true)).toBeNull();
});
