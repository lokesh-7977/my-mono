import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const csvPath = path.join(
  "C:\\DEV\\my-mono\\apps\\docs",
  "treks_rows (1).csv",
);

const csvFile = fs.readFileSync(csvPath, "utf-8");

const rows = parse(csvFile, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  relax_column_count: true,
}) as Record<string, string>[];

const slugs = [
  "kedarkantha",
  "valley-of-flowers",
  "hampta-pass",
  "roopkund",
  "brahmatal",
  "sandakphu",
];

const outDir = "C:\\DEV\\my-mono\\packages\\database\\trek-raw-data";
fs.mkdirSync(outDir, { recursive: true });

for (const s of slugs) {
  const match = rows.find((r) => r.slug?.toLowerCase().includes(s));
  if (!match) {
    console.log(`${s}: NOT FOUND`);
    continue;
  }
  fs.writeFileSync(
    path.join(outDir, `${s}.json`),
    JSON.stringify(match, null, 2),
  );
  console.log(`${s}: wrote ${Object.keys(match).length} fields`);
}
