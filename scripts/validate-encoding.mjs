import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const fix = process.argv.includes("--fix");
const extensions = new Set([".html", ".css", ".js", ".mjs", ".json", ".md", ".xml", ".txt"]);
const exactNames = new Set([".gitignore", "robots.txt"]);
const skippedDirectories = new Set([".git", ".edge-smoke", ".edge-smoke2", "node_modules"]);
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
const suspiciousPattern = /[\u00c3\u00c2\u00e2\u00f0\u00ef\ufffd]/g;

// Windows-1252 characters that differ from ISO-8859-1. This map lets the
// validator reverse accidental UTF-8-as-Windows-1252 decoding, including
// repeated decoding, without changing correctly encoded Unicode punctuation.
const windows1252Bytes = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
  [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
  [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
  [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
  [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b],
  [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f]
]);

function listTextFiles(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (skippedDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) listTextFiles(absolutePath, files);
    else if (extensions.has(path.extname(entry.name).toLowerCase()) || exactNames.has(entry.name)) files.push(absolutePath);
  }
  return files;
}

function decodeWindows1252AsUtf8(value) {
  const bytes = [];
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint <= 0xff) bytes.push(codePoint);
    else if (windows1252Bytes.has(codePoint)) bytes.push(windows1252Bytes.get(codePoint));
    else return null;
  }
  try {
    return utf8Decoder.decode(Uint8Array.from(bytes));
  } catch {
    return null;
  }
}

function repairMojibakeRun(value) {
  let repaired = value;
  for (let pass = 0; pass < 8; pass += 1) {
    const next = decodeWindows1252AsUtf8(repaired);
    if (next === null || next === repaired) break;
    repaired = next;
  }
  return repaired;
}

function repairText(value) {
  return value.replace(/[^\x00-\x7f]+/g, repairMojibakeRun);
}

const problems = [];
const changedFiles = [];
for (const absolutePath of listTextFiles(root)) {
  const relativePath = path.relative(root, absolutePath).split(path.sep).join("/");
  const bytes = fs.readFileSync(absolutePath);
  const hasBom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  let text;
  try {
    text = utf8Decoder.decode(hasBom ? bytes.subarray(3) : bytes);
  } catch {
    problems.push(`${relativePath}: invalid UTF-8 byte sequence`);
    continue;
  }

  const suspiciousCount = (text.match(suspiciousPattern) || []).length;
  if (hasBom) problems.push(`${relativePath}: UTF-8 BOM`);
  if (suspiciousCount) problems.push(`${relativePath}: ${suspiciousCount} mojibake marker(s)`);

  if (fix) {
    const repaired = repairText(text);
    const output = Buffer.from(repaired, "utf8");
    if (hasBom || !output.equals(bytes)) {
      fs.writeFileSync(absolutePath, output);
      changedFiles.push(relativePath);
    }
  }
}

if (fix) {
  console.log(`Repaired ${changedFiles.length} file(s).`);
  for (const file of changedFiles) console.log(file);
} else if (problems.length) {
  console.error(`Encoding validation failed with ${problems.length} problem(s):`);
  for (const problem of problems) console.error(problem);
  process.exitCode = 1;
} else {
  console.log("Encoding validation passed: all tracked text formats are UTF-8 without BOM and contain no mojibake markers.");
}
