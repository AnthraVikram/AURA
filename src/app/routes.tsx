import { Route, Routes } from "react-router-dom";
import { DailyLogPage } from "../modules/daily-log/DailyLogPage";
import { ExpensesPage } from "../modules/expenses/ExpensesPage";
import { GrowthPage } from "../modules/growth/GrowthPage";
import { HealthPage } from "../modules/health/HealthPage";
import { GoalsPage } from "../modules/goals/GoalsPage";
import { SettingsPage } from "../modules/settings/SettingsPage";
import { StudyPage } from "../modules/study/StudyPage";
import { HomePage } from "./HomePage";
import { Layout } from "./Layout";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="daily-log" element={<DailyLogPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="health" element={<HealthPage />} />
        <Route path="growth" element={<GrowthPage />} />
        <Route path="study" element={<StudyPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
