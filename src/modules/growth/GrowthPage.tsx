import { useAppStore } from "../../app/StoreContext";
import { GrowthService } from "./growthService";

const THEMES: Record<string, string> = {
  confidence_communication: "Confidence and communication",
  discipline_consistency: "Discipline and consistency",
  peace_focus: "Peace and focus",
  habits_character: "Habits and character",
  mental_emotional: "Mental and emotional growth",
  free_learning: "Useful free learning resources",
};

export function GrowthPage() {
  const { store } = useAppStore();
  const groups = new GrowthService(store).listByTheme();
  return (
    <section>
      <h2>Personal growth</h2>
      <p>Curated resources — not personalised recommendations from an intelligent system.</p>
      {Object.entries(groups).map(([theme, rows]) => (
        <div key={theme}>
          <h3>{THEMES[theme]}</h3>
          {rows.length === 0 ? null : (
            <ul>
              {rows.map((r) => (
                <li key={r.id}>
                  <a href={r.url} target="_blank" rel="noreferrer">
                    {r.title}
                  </a>{" "}
                  ({r.destinationLabel}
                  {r.kind === "youtube" ? ", opens on YouTube" : ""})
                  {r.claimsCertificate ? " — certificate offered by the destination" : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
