import type { LearningResource, ResourceTheme } from "../../domain/types";
import type { Store } from "../../storage/types";

export class GrowthService {
  constructor(private store: Store) {}

  listByTheme(): Record<ResourceTheme, LearningResource[]> {
    const rows = this.store.load().learningResources;
    const groups = {
      confidence_communication: [] as LearningResource[],
      discipline_consistency: [] as LearningResource[],
      peace_focus: [] as LearningResource[],
      habits_character: [] as LearningResource[],
      mental_emotional: [] as LearningResource[],
      free_learning: [] as LearningResource[],
    };
    for (const r of rows) groups[r.theme].push(r);
    return groups;
  }
}
