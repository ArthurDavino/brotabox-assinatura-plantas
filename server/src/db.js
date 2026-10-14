import { JSONFilePreset } from "lowdb/node";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "db.json");

const defaultData = {
  leads: [],
  clients: [],
  deliveries: [],
  reminders: [],
};

mkdirSync(dataDir, { recursive: true });

export async function getDb() {
  return JSONFilePreset(dataFile, defaultData);
}
