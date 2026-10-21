import fs from "node:fs";
import { execFileSync } from "node:child_process";

const git = args => execFileSync("git", args, { encoding: "utf8", maxBuffer: 128 * 1024 * 1024 });
const known = [];
if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)[A-Z0-9_]*)\s*=\s*(.*)$/);
    if (match) { const value = match[2].trim().replace(/^(["'])(.*)\1$/, "$2"); if (value.length >= 12) known.push(value); }
  }
}
const rules = [
  ["Resend key", /\bre_[A-Za-z0-9]{20,}\b/g],
  ["OpenAI key", /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}\b/g],
  ["GitHub token", /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{40,})\b/g],
  ["Google API key", /\bAIza[A-Za-z0-9_-]{35}\b/g],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g],
  ["Azure storage key", /AccountKey=[A-Za-z0-9+\/]{64,}={0,2}/g],
  ["Environment credential", /^\s*[A-Z_]*(?:API_KEY|ACCESS_TOKEN|SECRET_KEY|SECRET_ACCESS_KEY|PASSWORD)\s*=\s*["']?[A-Za-z0-9_+\/=-]{20,}["']?\s*$/gm],
  ["npm token", /:_authToken\s*=\s*[A-Za-z0-9_-]{20,}/g],
  ["AWS access key", /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g],
  ["Stripe secret", /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/g],
  ["Private key", /-----BEGIN (?:(?:RSA|EC|OPENSSH|DSA) )?PRIVATE KEY-----/g],
  ["JWT", /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\b/g],
  ["Credential assignment", /(?:api[_-]?key|auth[_-]?token|client[_-]?secret|password|private[_-]?key)["']?\s*[:=]\s*["']([A-Za-z0-9_+\/=.-]{24,})["']/gi],
  ["Authenticated URL", /https?:\/\/[^\s/"'<>:@]+:[^\s/"'<>@]{8,}@[^\s/"'<>]+/g],
];
const findings = [];
function inspect(content, path, location) {
  const text = content.toString("utf8");
  for (const [name, regex] of rules) {
    regex.lastIndex = 0;
    const matches = [...text.matchAll(regex)].filter(match => !(name === "Authenticated URL" && match[0] === "https://name:password@example.com"));
    if (matches.length) findings.push({ location, path, rule: name });
  }
  if (known.some(value => content.includes(Buffer.from(value)))) findings.push({ location, path, rule: "Actual local credential" });
}
if (process.argv.includes("--self-test")) {
  inspect(Buffer.from("re_" + "X".repeat(32)), "fixture", "test");
  if (!findings.some(f => f.rule === "Resend key")) throw new Error("Resend token detection failed.");
  findings.length = 0;
  inspect(Buffer.from("RESEND_API_KEY=\nCONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>"), ".env.example", "test");
  inspect(Buffer.from("https://name:password@example.com"), "fixture", "test");
  if (findings.length) throw new Error("Safe example was incorrectly flagged.");
  inspect(Buffer.from("https://user:" + "X".repeat(32) + "@host.example"), "fixture", "test");
  if (!findings.some(f => f.rule === "Authenticated URL")) throw new Error("URL credential detection failed.");
  console.log("PASS: secret scanner detects tokens and URL credentials while accepting empty templates and the exact fake test URL.");
  process.exit(0);
}
const tracked = git(["ls-files", "-z"]).split("\0").filter(Boolean);
const forbidden = /(^|\/)(?:\.env(?:\.(?!example$)[^/]*)?|\.dev\.vars[^/]*|\.git-credentials|credentials\.json|service-account[^/]*\.json|id_(?:rsa|ed25519)|[^/]*\.(?:pem|key|p12|pfx|sqlite|sqlite3|db))$/i;
for (const file of tracked) {
  if (forbidden.test(file)) findings.push({ location: "tracked", path: file, rule: "Sensitive filename" });
  if (fs.existsSync(file)) inspect(fs.readFileSync(file), file, "working tree");
}
const records = git(["rev-list", "--objects", "--all"]).trim().split("\n").filter(Boolean).map(line => { const space = line.indexOf(" "); return { sha: space < 0 ? line : line.slice(0, space), path: space < 0 ? "(Git object)" : line.slice(space + 1) }; });
const data = execFileSync("git", ["cat-file", "--batch"], { input: records.map(r => r.sha).join("\n") + "\n", maxBuffer: 128 * 1024 * 1024 });
let offset = 0; let blobCount = 0;
for (const record of records) {
  const newline = data.indexOf(10, offset); const header = data.subarray(offset, newline).toString("utf8").split(" ");
  const size = Number(header[2]); offset = newline + 1;
  if (header[1] === "blob") { blobCount++; inspect(data.subarray(offset, offset + size), record.path, "Git history " + record.sha.slice(0, 12)); if (forbidden.test(record.path)) findings.push({ location: "history", path: record.path, rule: "Sensitive filename" }); }
  offset += size + 1;
}
if (findings.length) { console.error(JSON.stringify({ status: "REVIEW REQUIRED", findings }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "PASS", trackedFiles: tracked.length, historicalBlobs: blobCount, checkedKnownLocalCredentials: known.length, message: "No matching credentials or sensitive filenames detected. Secret values are never printed." }));
