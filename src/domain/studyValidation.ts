import { validatePositiveNumber } from "./healthValidation";

export function validateDuration(minutes: unknown): string | null {
  return validatePositiveNumber(minutes, "Duration");
}
