import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import { createEmptyDocument } from "../../src/domain/emptyDocument";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const schema = JSON.parse(
  readFileSync(join(root, "specs/002-aura-foundation/contracts/storage.schema.json"), "utf8"),
);

test("empty v1 document matches storage schema", () => {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const { $schema: _s, ...body } = schema;
  void _s;
  const validate = ajv.compile(body);
  const doc = createEmptyDocument();
  expect(doc.schemaVersion).toBe(1);
  expect("chatMessages" in doc).toBe(false);
  expect(validate(doc)).toBe(true);
});
