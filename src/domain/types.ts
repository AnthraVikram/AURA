export type WeightUnit = "kg" | "lb";
export type DailyLogCategory = "activity" | "health" | "plan" | "learning" | "other";
export type CompletionStatus = "incomplete" | "complete";
export type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "health"
  | "education"
  | "other";
export type WorkoutType = "leg_day" | "back_and_biceps" | "chest_and_triceps" | "shoulders";
export type CardioType = "running" | "skipping";
export type GoalStatus = "active" | "completed";
export type ResourceTheme =
  | "confidence_communication"
  | "discipline_consistency"
  | "peace_focus"
  | "habits_character"
  | "mental_emotional"
  | "free_learning";
export type ResourceKind = "youtube" | "course" | "article";

export type Preferences = {
  displayName: string;
  currencySymbol: string;
  weightUnit: WeightUnit;
};

export type DailyLogEntry = {
  id: string;
  text: string;
  date: string;
  category: DailyLogCategory;
  status: CompletionStatus;
  createdAt: string;
  updatedAt: string;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type Exercise = {
  name: string;
  sets: number;
  repetitions: number;
  weight: number | null;
  weightUnit: WeightUnit | null;
};

export type WorkoutSession = {
  id: string;
  type: WorkoutType;
  date: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
};

export type CardioSession = {
  id: string;
  type: CardioType;
  date: string;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
};

export type WeightEntry = {
  id: string;
  value: number;
  unit: WeightUnit;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type TimedSession = {
  id: string;
  date: string;
  durationMinutes: number;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type Goal = {
  id: string;
  title: string;
  notes: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
};

export type Habit = {
  id: string;
  name: string;
  completions: string[];
  createdAt: string;
  updatedAt: string;
};

export type ChatOutcome = "success" | "clarification" | "unsupported" | "unknown" | "error" | "none";

export type ChatMessage = {
  id: string;
  role: "user" | "aura";
  text: string;
  createdAt: string;
  outcome: ChatOutcome;
  intentType: string | null;
};

export type LearningResource = {
  id: string;
  title: string;
  theme: ResourceTheme;
  kind: ResourceKind;
  url: string;
  destinationLabel: string;
  claimsCertificate: boolean;
  curated: true;
};

export type AppDocument = {
  schemaVersion: 1;
  preferences: Preferences;
  dailyLogEntries: DailyLogEntry[];
  expenses: Expense[];
  workoutSessions: WorkoutSession[];
  cardioSessions: CardioSession[];
  weightEntries: WeightEntry[];
  studySessions: TimedSession[];
  screenTimeEntries: TimedSession[];
  goals: Goal[];
  habits: Habit[];
  learningResources: LearningResource[];
};

export type OverviewItem = {
  kind: string;
  id: string;
  label: string;
  incomplete?: boolean;
};
