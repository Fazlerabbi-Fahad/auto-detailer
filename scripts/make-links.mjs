// Usage: npm run links            (reads ./leads.csv, writes ./links.csv)
//        npm run links -- in.csv out.csv
// Optional: BASE_URL=https://your-demo.vercel.app npm run links
//
// leads.csv columns: name, city, state, phone, ig, accent
// links.csv adds:    slug, url, short_url

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const [inArg = "leads.csv", outArg = "links.csv"] = process.argv.slice(2);
const BASE = (process.env.BASE_URL || "https://your-demo.vercel.app").replace(/\/+$/, "");
const DEFAULT_NAME = "Glossline Mobile Detailing";
const DEFAULT_ACCENT = "7FD3FF";
const STATES = new Set(
  "AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC".split(" "),
);

// Same rules as src/lib/personalize.js
const cleanText = (v = "") =>
  /[<>]/.test(String(v)) ? "" :
  String(v)
    .normalize("NFC")
    .replace(/[‘’]/g, "'")
    .replace(/[^\p{L}\p{M}\p{N} &'.,-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60)
    .trim();
const titleCase = (s) => s.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
const cleanPhone = (v = "") => {
  let d = String(v).replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return d.length === 10 ? d : "";
};
const cleanIg = (v = "") => {
  const h = String(v).trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/.*$/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(h) ? h : "";
};
const cleanAccent = (v = "") => {
  const h = String(v).trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{6}$/.test(h)) return h.toUpperCase();
  if (/^[0-9a-fA-F]{3}$/.test(h)) return h.replace(/./g, "$&$&").toUpperCase();
  return "";
};
const slugify = (s) =>
  cleanText(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

// Minimal RFC 4180 CSV parser (quotes, escaped quotes, commas and newlines in fields).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(cur);
      cur = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else cur += c;
  }
  if (cur || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}
const esc = (v) => (/[",\n\r]/.test(v) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

const inPath = resolve(inArg);
if (!existsSync(inPath)) {
  console.error(`Could not find ${inArg}. Create it with the header: name,city,state,phone,ig,accent`);
  process.exit(1);
}

const rows = parseCsv(readFileSync(inPath, "utf8").replace(/^﻿/, ""));
const header = rows.shift().map((h) => h.trim().toLowerCase());
const col = (r, k) => (header.indexOf(k) >= 0 ? r[header.indexOf(k)] ?? "" : "");

const seen = new Map();
const out = [["name", "city", "state", "phone", "ig", "accent", "slug", "url", "short_url"]];
const prospectEntries = [];

for (const r of rows) {
  const name = cleanText(col(r, "name"));
  const cityRaw = cleanText(col(r, "city"));
  const city = cityRaw ? titleCase(cityRaw) : "";
  const st = cleanText(col(r, "state")).toUpperCase();
  const state = STATES.has(st) ? st : "";
  const phone = cleanPhone(col(r, "phone"));
  const ig = cleanIg(col(r, "ig"));
  const accent = cleanAccent(col(r, "accent"));

  const q = new URLSearchParams();
  if (name && name !== DEFAULT_NAME) q.set("name", name);
  if (city) q.set("city", city);
  if (state) q.set("state", state);
  if (phone) q.set("phone", phone);
  if (ig) q.set("ig", ig);
  if (accent && accent !== DEFAULT_ACCENT) q.set("accent", accent);

  let slug = slugify(name) || "prospect";
  const n = (seen.get(slug) || 0) + 1;
  seen.set(slug, n);
  if (n > 1) slug = `${slug}-${slugify(city) || n}`;

  const url = `${BASE}/${q.toString() ? `?${q}` : ""}`;
  out.push([name, city, state, phone, ig, accent, slug, url, `${BASE}/p/${slug}`]);
  prospectEntries.push(
    `  ${JSON.stringify(slug)}: { name: ${JSON.stringify(name)}, city: ${JSON.stringify(city)}, state: ${JSON.stringify(state)}, phone: ${JSON.stringify(phone)}, ig: ${JSON.stringify(ig)}, accent: ${JSON.stringify(accent)} },`,
  );
}

writeFileSync(resolve(outArg), "﻿" + out.map((r) => r.map(esc).join(",")).join("\r\n") + "\r\n", "utf8");
console.log(`Wrote ${out.length - 1} links to ${outArg} (base ${BASE}).`);
console.log("\nPaste into src/data/prospects.js for /p/ short links:\n");
console.log(prospectEntries.join("\n"));
