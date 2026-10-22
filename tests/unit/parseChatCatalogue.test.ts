import { parseChat } from "../../src/chat/parseChat";
import { SUPPORTED_OPERATIONS } from "../../src/chat/supportedOperations";

test("catalogue intents and unsupported/unknown lists", () => {
  expect(parseChat("how much have I spent this week").kind).toBe("intent");
  expect(parseChat("summarise my day").kind).toBe("intent");
  expect(parseChat("I went to the gym today").kind).toBe("intent");
  expect(parseChat("add a plan to study machine learning tomorrow").kind).toBe("intent");
  const un = parseChat("create a calendar event tomorrow");
  expect(un.kind).toBe("unsupported");
  if (un.kind === "unsupported") {
    expect(un.message.toLowerCase()).toContain("not available yet");
    for (const op of SUPPORTED_OPERATIONS) {
      expect(un.message.toLowerCase()).toContain(op.toLowerCase());
    }
  }
  const unk = parseChat("blorple the quantum toaster");
  expect(unk.kind).toBe("unknown");
  if (unk.kind === "unknown") {
    expect(unk.message.toLowerCase()).toContain("did not understand");
    expect(unk.message.toLowerCase()).toContain("add an expense");
  }
});
