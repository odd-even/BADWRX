#!/usr/bin/env node
import { execSync, spawn } from "node:child_process";
import {
  existsSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pidFile = join(root, ".dev-server.pid");
const logFile = join(root, ".dev-server.log");
const clean = process.argv.includes("--clean");
const quiet = process.argv.includes("--quiet");

function log(message) {
  if (!quiet) console.log(message);
}

function killPort(port) {
  try {
    execSync(`lsof -ti :${port} | xargs kill -9 2>/dev/null`, {
      cwd: root,
      stdio: "ignore",
      shell: true,
    });
  } catch {
    // Port was not in use.
  }
}

function killExistingDevServer() {
  if (existsSync(pidFile)) {
    const pid = Number(readFileSync(pidFile, "utf8"));
    if (pid) {
      try {
        process.kill(pid, "SIGTERM");
      } catch {
        // Process already exited.
      }
    }
    rmSync(pidFile, { force: true });
  }

  killPort(3000);
}

function clearNextCache() {
  const cacheDir = join(root, ".next", "cache");
  if (existsSync(cacheDir)) {
    rmSync(cacheDir, { recursive: true, force: true });
    log("Cleared .next/cache");
  }
}

function startDevServer() {
  const localNode = join(root, ".node", "bin");
  const pathPrefix = existsSync(localNode)
    ? `${localNode}:${process.env.PATH ?? ""}`
    : process.env.PATH;

  const logFd = openSync(logFile, "a");
  const child = spawn("npx", ["next", "dev", "--turbopack"], {
    cwd: root,
    env: { ...process.env, PATH: pathPrefix },
    detached: true,
    stdio: ["ignore", logFd, logFd],
  });

  child.unref();
  writeFileSync(pidFile, String(child.pid));
  log(`Dev server running at http://localhost:3000 (pid ${child.pid})`);
  log(`Logs: ${logFile}`);
}

killExistingDevServer();
if (clean) clearNextCache();
startDevServer();
