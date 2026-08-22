import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { fetchLatestInsights } from "./insights-rss.mjs";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = resolve(rootDir, "insights.json");
const latestInsights = await fetchLatestInsights();
const nextContents = `${JSON.stringify(latestInsights, null, 2)}\n`;

let currentContents = "";
try {
  currentContents = await readFile(targetPath, "utf8");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

if (currentContents === nextContents) {
  console.log("No new blog entries. insights.json remains unchanged.");
} else {
  await writeFile(targetPath, nextContents, "utf8");
  console.log("Updated insights.json with the latest three blog entries.");
}
