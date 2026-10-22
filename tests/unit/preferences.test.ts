import { handleChat } from "../../src/chat/handleChat";
import { HealthService } from "../../src/modules/health/healthService";
import { PreferencesService } from "../../src/modules/settings/preferencesService";
import { MemoryStore } from "../../src/storage/memoryStore";

test("preference save and currency in chat", () => {
  const store = new MemoryStore();
  const prefs = new PreferencesService(store);
  expect(prefs.save({ currencySymbol: "" }).ok).toBe(false);
  expect(prefs.save({ currencySymbol: "$", weightUnit: "lb" }).ok).toBe(true);
  const chat = handleChat("Coffee 80", store);
  expect(chat.aura.text).toContain("$80");
});

test("historical weight keeps stored unit", () => {
  const store = new MemoryStore();
  const health = new HealthService(store);
  health.createWeight({ value: 70, unit: "kg" });
  new PreferencesService(store).save({ weightUnit: "lb" });
  expect(health.listWeights()[0].unit).toBe("kg");
  expect(health.listWeights()[0].value).toBe(70);
});
