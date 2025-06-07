/**
 * add-obsidian-nav.js
 *
 * Recursively scans a directory for files named:
 *   C1-Lesen-<ID>-Text.md
 *   C1-Lesen-<ID>-Unmarked-Text.md
 *   C1-Lesen-<ID>-Loesung.md
 *
 * For each unique <ID>, it builds an Obsidian-style navigation block of the form:
 *
 *   [[Lesen-C1-Teils|Tiles]] | [[Lesen-C1-Models|Models]]
 *   [[C1-Lesen-<ID>-Text|Text]]  | [[C1-Lesen-<ID>-Unmarked-Text|Unmarked-Text]] | [[C1-Lesen-<ID>-Loesung|Loesung]]
 *
 *   ---
 *
 *   [[prevLink|←]]     [[nextLink|→]]
 *
 *   ---
 *   ---
 *
 * Where:
 *   - prevLink is “C1-Lesen-<prevID>-Text” (if there is a smaller ID in sorted order), or just “←” alone.
 *   - nextLink is “C1-Lesen-<nextID>-Text” (if there is a larger ID in sorted order), or just “→” alone.
 *
 * It then prepends that block to each of the three files for ID: <ID>-Text.md, <ID>-Unmarked-Text.md, <ID>-Loesung.md.
 *
 * Usage:
 *   node add-obsidian-nav.js [rootDir]
 *
 * If rootDir is omitted, “process.cwd()” is used.
 */

const fs = require("fs");
const path = require("path");

const level = "C1";
const part = "Lesen"; // Lesen | Hoeren

// Build a string pattern using template literals
const pattern = `^${level}-${part}-(\\d+)-(Text|Unmarked-Text|Loesung)\\.md$`;
// Then pass it to RegExp
const FILE_REGEX = new RegExp(pattern);

// 2) Recursively walk a directory, accumulating all file paths in “allFiles” array.
function walkDir(dir, allFiles = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, allFiles);
    } else if (entry.isFile()) {
      allFiles.push(fullPath);
    }
  }
  return allFiles;
}

// 3) Build a map: ID (string) → { text: fullpath, unmarked: fullpath, loesung: fullpath }
function groupById(allPaths) {
  const map = new Map();
  for (const fullPath of allPaths) {
    const base = path.basename(fullPath);
    const match = base.match(FILE_REGEX);
    if (!match) continue;
    const id = match[1]; // e.g. "412"
    const kind = match[2]; // "Text" or "Unmarked-Text" or "Loesung"
    if (!map.has(id)) {
      map.set(id, { Text: null, "Unmarked-Text": null, Loesung: null });
    }
    map.get(id)[kind] = fullPath;
  }
  return map;
}

function getPrevNext(id) {
  console.log(id);
  const prevIdTest = `${new Number(id) - 10}`;
  const prev = prevIdTest[1] > 0 ? prevIdTest : null;
  console.log(prevIdTest);

  const nextIdTest = `${new Number(id) + 10}`;
  console.log(prevIdTest);

  const next = nextIdTest[1] < 5 ? nextIdTest : null;
  return { prev, next };
}

// 5) Given an ID, and its prev/next, generate the three-line nav header.
function buildNavBlock(id, prevId, nextId) {
  const threeSpaces = "   ";

  // Always link back to Tiles and Models:
  // "[[Lesen-C1-Teils|Tiles]] | [[Lesen-C1-Models|Models]]"
  const line1 =
    threeSpaces +
    `[[0-${level}-${part}-T${id[1]}-Ubung-List|Tiles]] | [[${part}-${level}-Models|Models]]`;

  // Central line: link to the three pages for this same ID
  const line2 =
    threeSpaces +
    `[[${level}-${part}-${id}-Text|Text]]  | [[${level}-${part}-${id}-Unmarked-Text|Unmarked-Text]] | [[${level}-${part}-${id}-Loesung|Loesung]]`;

  // Separator
  const sep1 = "\n---\n";

  // Prev / Next: if prevId is null, just a bare '←', else link "[[${level}-${part}-<prevId>-Text|←]]"
  const prevLink = prevId ? `[[${level}-${part}-${prevId}-Text|←]]` : "←";
  // Next: similarly
  const nextLink = nextId ? `[[${level}-${part}-${nextId}-Text|→]]` : "→";

  // e.g. “[[...|←]]        [[...|→]]”
  const line3 = `${prevLink}${threeSpaces}${threeSpaces}${threeSpaces}${nextLink}`;

  // Finally two more separators
  const sep2 = `\n---
---\n\n`;

  // Join them all with newlines and a trailing blank line
  return [line1, line2, sep1, line3, sep2].join("\n");
}

// 6) For a given file, read its contents, prepend navBlock + "\n", then overwrite it.
function prependNavToFile(filePath, navBlock) {
  const original = fs.readFileSync(filePath, "utf8");
  const updated = navBlock + original;
  fs.writeFileSync(filePath, updated, "utf8");
}

// === MAIN ===
(function main() {
  // Allow user to pass a root directory as the first argument; default to current working dir.
  const rootDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(process.cwd(), `../${level}-${part}`);

  console.log(`Scanning directory: ${rootDir}`);

  // 1) Find all files
  const allFiles = walkDir(rootDir);

  // 2) Group them by ID
  const idMap = groupById(allFiles);

  // Filter out any IDs that don't have all three variants (Text, Unmarked-Text, Loesung).
  // Depending on your needs, you can also choose to process partially missing sets, but here we only
  // generate nav for IDs where all three are present.
  const completeIds = [];

  for (const [id, trio] of idMap.entries()) {
    // 1) Find one existing sibling path to determine the base directory:
    const existingPaths = [
      trio.Text,
      trio["Unmarked-Text"],
      trio.Loesung,
    ].filter((p) => p !== null);
    const baseDir = existingPaths.length
      ? path.dirname(existingPaths[0])
      : path.resolve(rootDir); // fallback if somehow none exist

    if ([`412`, `422`, `432`, `442`].includes(id)) {
      continue;
    }

    // 2) For each of the three variants, if it's missing, create it as an empty file:
    if (!trio.Text) {
      trio.Text = path.join(baseDir, `${level}-${part}-${id}-Text.md`);
      fs.writeFileSync(trio.Text, "", "utf8");
    }
    if (!trio["Unmarked-Text"]) {
      trio["Unmarked-Text"] = path.join(
        baseDir,
        `${level}-${part}-${id}-Unmarked-Text.md`
      );
      fs.writeFileSync(trio["Unmarked-Text"], "", "utf8");
    }
    if (!trio.Loesung) {
      trio.Loesung = path.join(baseDir, `${level}-${part}-${id}-Loesung.md`);
      fs.writeFileSync(trio.Loesung, "", "utf8");
    }

    // 3) Now that all three files exist (possibly just created), include this ID in the list:
    completeIds.push(id);
  }

  // 3) Sort IDs numerically (they are strings, but they represent numbers)
  completeIds.sort((a, b) => Number(a) - Number(b));

  // 5) For each ID, generate nav block and prepend to each of the three files:
  let filesUpdated = 0;
  for (const id of completeIds) {
    const { prev, next } = getPrevNext(id);
    const navBlock = buildNavBlock(id, prev, next);

    // Paths to the three markdown files:
    const trio = idMap.get(id);
    [trio.Text, trio["Unmarked-Text"], trio.Loesung].forEach((filePath) => {
      prependNavToFile(filePath, navBlock);
      filesUpdated++;
      console.log(`  → Updated: ${filePath}`);
    });
  }

  console.log(`\nDone. Total files updated: ${filesUpdated}`);
})();
