#!/usr/bin/env node
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { hookInputNeedsDevRestart } from "../../scripts/dev-change-paths.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { raw };
  }
}

const input = await readStdin();

if (hookInputNeedsDevRestart(input)) {
  spawn("node", ["scripts/restart-dev.mjs", "--clean", "--quiet"], {
    cwd: root,
    detached: true,
    stdio: "ignore",
  }).unref();
}

console.log(JSON.stringify({}));
