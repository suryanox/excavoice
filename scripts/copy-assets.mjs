import { mkdir, cp } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function copy(src, dest) {
  await mkdir(dirname(dest), { recursive: true });
  await cp(src, dest, { recursive: true });
}

await copy(join(root, "src/manifest.json"), join(root, "extension/manifest.json"));
await copy(join(root, "src/icons"), join(root, "extension/icons"));

console.log("Copied manifest.json and icons into extension/");
