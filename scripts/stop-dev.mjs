#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pidFile = join(root, ".dev-server.pid");

if (existsSync(pidFile)) {
  const pid = Number(readFileSync(pidFile, "utf8"));
  if (pid) {
    try {
      process.kill(pid, "SIGTERM");
      console.log(`Stopped dev server (pid ${pid})`);
    } catch {
      console.log("Dev server was not running.");
    }
  }
  rmSync(pidFile, { force: true });
}

try {
  execSync("lsof -ti :3000 | xargs kill -9 2>/dev/null", {
    cwd: root,
    stdio: "ignore",
    shell: true,
  });
} catch {
  // Nothing listening on port 3000.
}
