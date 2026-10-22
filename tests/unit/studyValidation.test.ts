import { MemoryStore } from "../../src/storage/memoryStore";
import { StudyService } from "../../src/modules/study/studyService";
import { validateDuration } from "../../src/domain/studyValidation";

test("duration > 0", () => {
  expect(validateDuration(25)).toBeNull();
  expect(validateDuration(0)).toBeTruthy();
});

test("summaries source manual", () => {
  const store = new MemoryStore();
  const svc = new StudyService(store);
  svc.createStudy({ durationMinutes: 30 });
  expect(svc.summaries("study").source).toBe("manual");
  expect(svc.summaries("study").today).toBe(30);
});
