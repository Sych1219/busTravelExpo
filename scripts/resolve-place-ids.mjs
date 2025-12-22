import fs from "node:fs";
import path from "node:path";

function readDotEnv(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const env = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
    return env;
  } catch {
    return {};
  }
}

const dotEnvPath = path.join(process.cwd(), ".env");
const dotEnv = readDotEnv(dotEnvPath);
const API_KEY = process.env.GOOGLE_API_KEY || dotEnv.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("Missing GOOGLE_API_KEY (set env var or add it to .env)");
  process.exit(1);
}

const queries = [
  { label: "Changi Airport", query: "Changi Airport" },
  { label: "Orchard Road", query: "Orchard Road" },
  { label: "Bugis", query: "Bugis" },
  { label: "Marina Bay Sands", query: "Marina Bay Sands" },
];

async function resolvePlaceIdFromText(text) {
  const url =
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
    `?input=${encodeURIComponent(text)}` +
    `&inputtype=textquery` +
    `&fields=place_id,formatted_address,name` +
    `&language=en` +
    `&components=country:sg` +
    `&key=${encodeURIComponent(API_KEY)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = await response.json();
  const candidate = json?.candidates?.[0];
  const placeId = candidate?.place_id ?? "";
  const description = candidate?.formatted_address ?? candidate?.name ?? text;
  return placeId ? { placeId, description } : null;
}

const out = [];
for (const item of queries) {
  try {
    const resolved = await resolvePlaceIdFromText(item.query);
    out.push({ ...item, placeId: resolved?.placeId ?? "", description: resolved?.description ?? "" });
  } catch (e) {
    out.push({ ...item, placeId: "", error: String(e) });
  }
}

console.log(JSON.stringify(out, null, 2));
