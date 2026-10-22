import { OverviewService } from "./overviewService";
import { BarChart, EmptyChart, Ring, Sparkline, StackBars } from "./charts/Charts";
import {
  dailyExpenseSeries,
  expenseCategoryTotals,
  formatShortDate,
  movementByDay,
  timedByDay,
  weightTrend,
} from "../domain/dashboardStats";
import { expenseCategoryLabel } from "../domain/expenseCategories";
import { expenseTotals } from "../domain/expenseTotals";
import { formatMoney } from "../domain/money";
import { productivityScore } from "../domain/productivityScore";
import { localToday } from "../domain/dates";
import { useAppStore } from "./StoreContext";

export function DashboardCards() {
  const { store, revision } = useAppStore();
  void revision;
  const doc = store.load();
  const today = localToday();
  const symbol = doc.preferences.currencySymbol;
  const prod = productivityScore(doc, today);
  const totals = expenseTotals(doc.expenses, today);
  const weekSeries = dailyExpenseSeries(doc.expenses, 7, today);
  const weekHasSpend = weekSeries.some((d) => d.amount > 0);
  const todayExpenses = doc.expenses.filter((e) => e.date === today);
  const cats = expenseCategoryTotals(todayExpenses);
  const movement = movementByDay(doc, 7, today);
  const moveHas = movement.some((d) => d.count > 0);
  const todayWorkouts = doc.workoutSessions.filter((w) => w.date === today);
  const todayCardio = doc.cardioSessions.filter((c) => c.date === today);
  const cardioMin = todayCardio.reduce((s, c) => s + c.durationMinutes, 0);
  const trend = weightTrend(doc.weightEntries);
  const studyTodayRows = doc.studySessions.filter((s) => s.date === today);
  const screenTodayRows = doc.screenTimeEntries.filter((s) => s.date === today);
  const studyMin = studyTodayRows.reduce((s, r) => s + r.durationMinutes, 0);
  const screenMin = screenTodayRows.reduce((s, r) => s + r.durationMinutes, 0);
  const studyWeekSeries = timedByDay(doc.studySessions, 7, today);
  const screenWeekSeries = timedByDay(doc.screenTimeEntries, 7, today);
  const studyWeek = studyWeekSeries.reduce((s, d) => s + d.minutes, 0);
  const screenWeek = screenWeekSeries.reduce((s, d) => s + d.minutes, 0);
  const hasStudyWeek = doc.studySessions.some((s) => studyWeekSeries.some((d) => d.date === s.date && d.minutes > 0));
  const hasScreenWeek = doc.screenTimeEntries.some((s) =>
    screenWeekSeries.some((d) => d.date === s.date && d.minutes > 0),
  );
  const goalsDone = doc.goals.filter((g) => g.status === "completed").length;
  const habitsDone = doc.habits.filter((h) => h.completions.includes(today)).length;
  const timeline = new OverviewService(store).dailyOverview(today).filter((i) => {
    if (i.kind !== "daily-log") return true;
    const e = doc.dailyLogEntries.find((x) => x.id === i.id);
    return e?.date === today;
  });

  return (
    <div className="dash-grid">
      <article className="card dash-card">
        <h3>Daily productivity</h3>
        {prod.score === null ? (
          <p className="empty">{prod.reason}</p>
        ) : (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Ring value={prod.score} label={`Productivity ${prod.score} of 100`} />
            <div>
              <p className="metric">
                {prod.score}
                <small> / 100</small>
              </p>
              <p className="empty">{prod.reason}</p>
            </div>
          </div>
        )}
        <ul className="factor-list">
          {prod.factors.map((f) => (
            <li key={f.id}>
              {f.included ? `${f.label}: ${f.value}/100 — ${f.detail}` : f.detail}
            </li>
          ))}
        </ul>
        <p className="empty">This is a local tally of what you recorded, not a judgement of you.</p>
      </article>

      <article className="card dash-card">
        <h3>Expenses</h3>
        {doc.expenses.length ? (
          <>
            <p className="metric">
              {todayExpenses.length ? (
                <>
                  {formatMoney(totals.today, symbol)} <small>today</small>
                </>
              ) : (
                <small>No expenses logged yet today</small>
              )}
            </p>
            {weekHasSpend ? (
              <BarChart
                ariaLabel="Spending last 7 days"
                points={weekSeries.map((d) => ({ label: formatShortDate(d.date), value: d.amount }))}
                format={(n) => formatMoney(n, symbol)}
              />
            ) : (
              <EmptyChart>No spending in the last 7 days.</EmptyChart>
            )}
            {cats.length ? (
              <p className="empty">
                {cats.map((c) => `${expenseCategoryLabel(c.category)} ${formatMoney(c.amount, symbol)}`).join(" · ")}
              </p>
            ) : null}
          </>
        ) : (
          <p className="empty">No expenses logged yet.</p>
        )}
      </article>

      <article className="card dash-card">
        <h3>Health &amp; Fitness</h3>
        {todayWorkouts.length || todayCardio.length || trend ? (
          <>
            <p>
              {todayWorkouts.length
                ? `${todayWorkouts.length} gym session${todayWorkouts.length === 1 ? "" : "s"} today`
                : "No gym session logged today."}
            </p>
            <p>
              {todayCardio.length ? `${cardioMin} min cardio today` : "No cardio logged today."}
            </p>
            {moveHas ? (
              <BarChart
                ariaLabel="Workouts in the last 7 days"
                points={movement.map((d) => ({ label: formatShortDate(d.date), value: d.count }))}
              />
            ) : (
              <EmptyChart>No workouts in the last 7 days.</EmptyChart>
            )}
            {trend ? (
              <>
                <p className="empty">Weight trend ({trend.unit}, stored unit, not converted)</p>
                <Sparkline values={trend.points.map((p) => p.value)} ariaLabel={`Weight in ${trend.unit}`} />
              </>
            ) : (
              <EmptyChart>Need two weight records in the same unit for a trend.</EmptyChart>
            )}
          </>
        ) : (
          <p className="empty">No workout recorded today. Weight trend needs two saved records in the same unit.</p>
        )}
      </article>

      <article className="card dash-card">
        <h3>Study &amp; Focus</h3>
        <p className="empty">Manually entered. AURA does not measure device or app usage.</p>
        {studyTodayRows.length || screenTodayRows.length || hasStudyWeek || hasScreenWeek ? (
          <>
            {studyTodayRows.length ? (
              <p className="metric">
                {studyMin} min <small>study today (manual)</small>
              </p>
            ) : (
              <p className="empty">No study time recorded yet.</p>
            )}
            {screenTodayRows.length ? (
              <p>{screenMin} min screen today (manual)</p>
            ) : (
              <p className="empty">No screen time recorded yet.</p>
            )}
            <StackBars
              items={[
                ...(hasStudyWeek ? [{ label: "Study week (manual)", value: studyWeek }] : []),
                ...(hasScreenWeek
                  ? [{ label: "Screen week (manual)", value: screenWeek, tone: "cyan" as const }]
                  : []),
              ]}
            />
          </>
        ) : (
          <p className="empty">No study or screen time recorded yet.</p>
        )}
      </article>

      <article className="card dash-card">
        <h3>Goals &amp; Habits</h3>
        {doc.goals.length || doc.habits.length ? (
          <>
            {doc.goals.length ? (
              <p>
                Goals {goalsDone}/{doc.goals.length} completed
              </p>
            ) : (
              <p className="empty">No goals saved yet.</p>
            )}
            {doc.habits.length ? (
              <p>
                Habits {habitsDone}/{doc.habits.length} done today
              </p>
            ) : (
              <p className="empty">No habits saved yet.</p>
            )}
            {doc.goals.length ? (
              <Ring
                value={doc.goals.length ? Math.round((goalsDone / doc.goals.length) * 100) : 0}
                label="Goal completion"
              />
            ) : (
              <EmptyChart>No goals saved yet.</EmptyChart>
            )}
          </>
        ) : (
          <p className="empty">No goals or habits saved yet.</p>
        )}
      </article>

      <article className="card dash-card">
        <h3>Daily activity</h3>
        {timeline.length === 0 ? (
          <p className="empty">Nothing recorded for today.</p>
        ) : (
          <ul className="timeline">
            {timeline.map((i) => (
              <li key={`${i.kind}-${i.id}`} className={i.incomplete ? "incomplete" : undefined}>
                <span>{i.label}</span>
                <span className="empty">{i.kind}</span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}
