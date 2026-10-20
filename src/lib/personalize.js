import brand from "@/brand.config";
import prospects from "@/data/prospects";

const MAX = 60;

export const US_STATES = new Set(
  "AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC".split(
    " ",
  ),
);

function first(v) {
  return Array.isArray(v) ? v[0] : v;
}

// Letters (any language), numbers, spaces, and & ' . - , only.
export function cleanText(v) {
  const raw = first(v);
  if (typeof raw !== "string" || /[<>]/.test(raw)) return "";
  return raw
    .normalize("NFC")
    .replace(/[‘’]/g, "'")
    .replace(/[^\p{L}\p{M}\p{N} &'.,-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX)
    .trim();
}

export function titleCase(s) {
  return s.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
}

export function cleanState(v) {
  const s = cleanText(v).toUpperCase();
  return US_STATES.has(s) ? s : "";
}

export function cleanPhone(v) {
  let d = (typeof first(v) === "string" ? first(v) : "").replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return d.length === 10 ? d : "";
}

export function formatPhone(d) {
  return d ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : "";
}

export function cleanIg(v) {
  const raw = first(v);
  if (typeof raw !== "string") return "";
  const h = raw.trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/.*$/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(h) ? h : "";
}

export function cleanAccent(v) {
  const raw = first(v);
  if (typeof raw !== "string") return "";
  const h = raw.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{6}$/.test(h)) return h.toUpperCase();
  if (/^[0-9a-fA-F]{3}$/.test(h)) return h.replace(/./g, "$&$&").toUpperCase();
  return "";
}

// WCAG relative luminance -> pick black or white text on the accent.
function luminance(hex) {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = c.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrastText(hex) {
  const L = luminance(hex);
  const onBlack = (L + 0.05) / 0.05;
  const onWhite = 1.05 / (L + 0.05);
  return onBlack >= onWhite ? "#0B0C0E" : "#FFFFFF";
}

// Accent used as text on the dark ground must stay readable (AA 4.5:1 vs #0B0C0E).
// If the brand color is too dark, lighten it for text use only.
export function accentForText(hex) {
  const bgL = luminance("0B0C0E");
  let [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  for (let i = 0; i < 20; i++) {
    const cur = [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
    if ((luminance(cur) + 0.05) / (bgL + 0.05) >= 4.6) return "#" + cur.toUpperCase();
    r = Math.round(r + (255 - r) * 0.15);
    g = Math.round(g + (255 - g) * 0.15);
    b = Math.round(b + (255 - b) * 0.15);
  }
  return "#FFFFFF";
}

function build(src) {
  const d = brand.defaults;
  const name = cleanText(src.name);
  const city = cleanText(src.city);
  const state = cleanState(src.state);
  const phone = cleanPhone(src.phone);
  const ig = cleanIg(src.ig);
  const accent = cleanAccent(src.accent) || d.accent;

  const biz = {
    name: name || d.name,
    city: city ? titleCase(city) : d.city,
    hasCity: Boolean(city),
    state: state || d.state,
    phone: phone || cleanPhone(d.phone),
    ig: ig || cleanIg(d.ig),
    accent,
    isPersonalized: Boolean(name || city),
  };
  biz.phoneDisplay = formatPhone(biz.phone);
  biz.cityState = biz.hasCity && biz.state ? `${biz.city}, ${biz.state}` : biz.city;
  biz.accentInk = contrastText(accent);
  biz.accentText = accentForText(accent);
  return biz;
}

export function getBusiness(searchParams = {}) {
  return build(searchParams || {});
}

export function getProspect(slug) {
  const key = typeof slug === "string" ? slug.toLowerCase() : "";
  const p = Object.prototype.hasOwnProperty.call(prospects, key) ? prospects[key] : {};
  return build(p);
}

export function slugify(s) {
  return cleanText(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Query string that reproduces this business (for OG image URLs and links).
export function toQuery(biz) {
  const q = new URLSearchParams();
  const d = brand.defaults;
  if (biz.name !== d.name) q.set("name", biz.name);
  if (biz.hasCity) q.set("city", biz.city);
  if (biz.state) q.set("state", biz.state);
  if (biz.phone) q.set("phone", biz.phone);
  if (biz.ig) q.set("ig", biz.ig);
  if (biz.accent !== d.accent) q.set("accent", biz.accent);
  return q.toString();
}
