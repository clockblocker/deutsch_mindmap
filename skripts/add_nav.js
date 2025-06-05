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
 *   [[0-C1-Lesen-T1-Ubung-List|Tiles]] | [[Lesen-C1-Models|Models]]
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

// 1) Regular expression to match exactly the three kinds of files we care about.
const FILE_REGEX = /^C1-Lesen-(\d+)-(Text|Unmarked-Text|Loesung)\.md$/;

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

// 4) Given a sorted array of IDs, return for each index i the “prev” and “next” ID or null if none.
function buildPrevNextMap(sortedIds) {
  const prevNext = {};
  for (let i = 0; i < sortedIds.length; i++) {
    const id = sortedIds[i];
    const prevId = i > 0 ? sortedIds[i - 1] : null;
    const nextId = i < sortedIds.length - 1 ? sortedIds[i + 1] : null;
    prevNext[id] = { prev: prevId, next: nextId };
  }
  return prevNext;
}

// 5) Given an ID, and its prev/next, generate the three-line nav header.
function buildNavBlock(id, prevId, nextId) {
  const threeSpaces = "   ";

  // Always link back to Tiles and Models:
  // "[[0-C1-Lesen-T1-Ubung-List|Tiles]] | [[Lesen-C1-Models|Models]]"
  const line1 =
    threeSpaces +
    "[[0-C1-Lesen-T1-Ubung-List|Tiles]] | [[Lesen-C1-Models|Models]]";

  // Central line: link to the three pages for this same ID
  const line2 =
    threeSpaces +
    `[[C1-Lesen-${id}-Text|Text]]  | [[C1-Lesen-${id}-Unmarked-Text|Unmarked-Text]] | [[C1-Lesen-${id}-Loesung|Loesung]]`;

  // Separator
  const sep1 = "---";

  // Prev / Next: if prevId is null, just a bare '←', else link "[[C1-Lesen-<prevId>-Text|←]]"
  const prevLink = prevId ? `[[C1-Lesen-${prevId}-Text|←]]` : "←";
  // Next: similarly
  const nextLink = nextId ? `[[C1-Lesen-${nextId}-Text|→]]` : "→";

  // e.g. “[[...|←]]        [[...|→]]”
  const line3 = `${prevLink}${threeSpaces}${threeSpaces}${threeSpaces}${nextLink}`;

  // Finally two more separators
  const sep2 = `---
  ---`;

  // Join them all with newlines and a trailing blank line
  return [line1, line2, "", sep1, "", line3, "", sep2, "", ""].join("\n");
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
    : path.resolve(process.cwd(), "../C1-Lesen");

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
    if (trio.Text && trio["Unmarked-Text"] && trio.Loesung) {
      completeIds.push(id);
    } else {
      console.warn(
        `Skipping ID ${id}: incomplete set (missing one of Text/Unmarked-Text/Loesung)`
      );
    }
  }

  // 3) Sort IDs numerically (they are strings, but they represent numbers)
  completeIds.sort((a, b) => Number(a) - Number(b));

  // 4) Build prev/next lookup
  const prevNext = buildPrevNextMap(completeIds);

  // 5) For each ID, generate nav block and prepend to each of the three files:
  let filesUpdated = 0;
  for (const id of completeIds) {
    const { prev, next } = prevNext[id];
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
