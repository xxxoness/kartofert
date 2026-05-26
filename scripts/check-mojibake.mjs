import fs from "node:fs";
import path from "node:path";

const ROOTS = ["app", "components", "lib", "data", "config", "prisma"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md"]);
const MOJIBAKE = /Рљ|Рџ|Р”|Р‘|Р’|Рњ|Рќ|Рћ|Рў|РЈ|Р¤|РҐ|Р°|Рµ|РЅ|Рё|СЏ|С†|С‚|СЃ|СЊ|С‹|С‡|С€|С‰|в‚|вЂ/g;

function walk(dir, result = []) {
  if (!fs.existsSync(dir)) return result;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(filePath, result);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      result.push(filePath);
    }
  }
  return result;
}

const matches = [];

for (const root of ROOTS) {
  for (const filePath of walk(root)) {
    const content = fs.readFileSync(filePath, "utf8");
    const found = content.match(MOJIBAKE);
    if (found?.length) {
      matches.push({ filePath, count: found.length });
    }
  }
}

matches.sort((a, b) => b.count - a.count);

if (matches.length) {
  console.error("Mojibake-like text found:");
  for (const match of matches) {
    console.error(`${match.count.toString().padStart(5)}  ${match.filePath}`);
  }
  process.exit(1);
}

console.log("No mojibake-like text found.");
