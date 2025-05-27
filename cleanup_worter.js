const fs = require("fs/promises");
const path = require("path");

const SOURCE_ROOT = "Worter-Old";
const DEST_ROOT = "Worter2/Ordered";

function getShardPath(originalName) {
  const shardKey = originalName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
    .padEnd(4, "_");

  const first = shardKey[0];
  const prefix = shardKey.slice(0, 3);
  const shard = shardKey[3];

  return path.join(DEST_ROOT, first, prefix, shard);
}

function getSafeFileName(name) {
  return name.replace(/[\\/:*?"<>|]/g, "") + ".md";
}

async function* walk(dir) {
  for await (const dirent of await fs.readdir(dir, { withFileTypes: true })) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* walk(res);
    } else if (res.endsWith(".md")) {
      yield res;
    }
  }
}

async function migrateRecursive() {
  let moved = 0,
    skipped = 0,
    failed = 0;

  for await (const sourcePath of walk(SOURCE_ROOT)) {
    const originalName = path.basename(sourcePath, ".md");
    const targetDir = getShardPath(originalName);
    const targetFile = path.join(targetDir, getSafeFileName(originalName));

    try {
      await fs.mkdir(targetDir, { recursive: true });

      try {
        await fs.access(targetFile);
        console.warn(`SKIP: ${sourcePath} → ${targetFile} (already exists)`);
        skipped++;
        continue;
      } catch {
        // target doesn't exist—continue
      }

      await fs.rename(sourcePath, targetFile);
      console.log(`MOVED: ${sourcePath} → ${targetFile}`);
      moved++;
    } catch (err) {
      console.error(`FAIL: ${sourcePath} → ${targetFile}`, err);
      failed++;
    }
  }

  console.log(
    `\nDeep migration complete. Moved: ${moved}, Skipped: ${skipped}, Failed: ${failed}`
  );
}

migrateRecursive();
