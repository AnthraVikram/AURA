export const SUPPORTED_OPERATIONS = [
  "add an expense",
  "ask spending today, this week, or overall",
  "list recent expenses",
  "add or list Daily Log entries",
  "mark a Daily Log entry complete or incomplete",
  "summarise today",
  "log a gym or cardio session",
  "list recent workouts",
  "record body weight",
  "log a study session",
  "add a goal",
];

export function operationsListText(): string {
  return `I can: ${SUPPORTED_OPERATIONS.join("; ")}.`;
}

export const NOT_AI_NOTE =
  "AURA follows saved commands; it is not advanced AI reasoning.";
