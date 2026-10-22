import catalogue from "../data/learningResources.json";
import type { AppDocument, LearningResource } from "./types";

export function createEmptyDocument(): AppDocument {
  return {
    schemaVersion: 1,
    preferences: {
      displayName: "",
      currencySymbol: "₹",
      weightUnit: "kg",
    },
    dailyLogEntries: [],
    expenses: [],
    workoutSessions: [],
    cardioSessions: [],
    weightEntries: [],
    studySessions: [],
    screenTimeEntries: [],
    goals: [],
    habits: [],
    learningResources: catalogue as LearningResource[],
  };
}
