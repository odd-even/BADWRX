#!/usr/bin/env node
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

const RESTART_COMMAND =
  /sync:source|sync-source-data|sync-public-images|npm run build|restart-dev/;

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { command: raw };
  }
}

const input = await readStdin();
const command = String(input.command ?? input.shellCommand ?? "");

if (RESTART_COMMAND.test(command)) {
  spawn("node", ["scripts/restart-dev.mjs", "--clean", "--quiet"], {
    cwd: root,
    detached: true,
    stdio: "ignore",
  }).unref();
}

console.log(JSON.stringify({}));
