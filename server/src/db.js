import { JSONFilePreset } from "lowdb/node";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, "..", "data", "db.json");

const defaultData = {
  leads: [],
  clients: [],
  deliveries: [],
  reminders: [],
};

export async function getDb() {
  return JSONFilePreset(dataFile, defaultData);
}
