#!/usr/bin/env node
import { watch } from "node:fs";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { isMajorDevChange, normalizeDevPath } from "./dev-change-paths.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const WATCH_DIRS = [
  "src/data",
  "src/lib/source-data",
  "scripts",
  "_assets",
  "public/images",
].map((dir) => join(root, dir));

let restartTimer;
let restarting = false;

function restartDevServer(reason) {
  if (restarting) return;
  restarting = true;

  log(`Major change detected (${reason}). Restarting dev server…`);

  const child = spawn("node", ["scripts/restart-dev.mjs", "--clean"], {
    cwd: root,
    stdio: "inherit",
  });

  child.on("close", () => {
    restarting = false;
  });
}

function scheduleRestart(reason) {
  clearTimeout(restartTimer);
  restartTimer = setTimeout(() => restartDevServer(reason), 1200);
}

function handleWatchEvent(eventType, filePath) {
  if (!filePath || eventType === "change" || eventType === "rename") {
    const rel = normalizeDevPath(relative(root, filePath ?? ""));
    if (!rel || rel.startsWith("..")) return;
    if (!isMajorDevChange(rel)) return;
    scheduleRestart(rel);
  }
}

function log(message) {
  console.log(`[dev-watch] ${message}`);
}

function watchDir(dir) {
  if (!existsSync(dir)) return;

  watch(dir, { recursive: true }, (eventType, filePath) => {
    handleWatchEvent(eventType, filePath ? join(dir, filePath) : dir);
  });

  log(`Watching ${relative(root, dir)}`);
}

log("Starting dev server with auto-restart on major data changes…");
spawn("node", ["scripts/restart-dev.mjs"], {
  cwd: root,
  stdio: "inherit",
});

for (const dir of WATCH_DIRS) watchDir(dir);

process.on("SIGINT", () => {
  log("Stopping watcher.");
  spawn("node", ["scripts/stop-dev.mjs"], { cwd: root, stdio: "inherit" });
  process.exit(0);
});
