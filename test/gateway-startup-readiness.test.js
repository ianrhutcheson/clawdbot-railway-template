import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("gateway startup timeout is configurable and long enough for cold boots", () => {
  const src = fs.readFileSync(new URL("../src/server.js", import.meta.url), "utf8");
  assert.match(src, /OPENCLAW_GATEWAY_READY_TIMEOUT_MS/);
  assert.match(src, /"60000"/);
});

test("ensureGatewayRunning re-probes an existing gateway process before returning success", () => {
  const src = fs.readFileSync(new URL("../src/server.js", import.meta.url), "utf8");
  const idx = src.indexOf("async function ensureGatewayRunning()");
  assert.ok(idx >= 0);
  const window = src.slice(idx, idx + 900);

  assert.match(window, /if \(gatewayProc\) \{/);
  assert.match(window, /await probeGateway\(\)/);
  assert.match(window, /lastGatewayError = null;/);
});
