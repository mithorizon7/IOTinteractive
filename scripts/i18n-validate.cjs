const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const LOCALES_DIR = path.join(ROOT, "client", "src", "locales");
const SRC_DIR = path.join(ROOT, "client", "src");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listDirs(dirPath) {
  return fs
    .readdirSync(dirPath)
    .filter((name) => fs.statSync(path.join(dirPath, name)).isDirectory());
}

function walkFiles(dirPath, predicate) {
  const results = [];
  for (const entry of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...walkFiles(fullPath, predicate));
    } else if (predicate(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

function hasPath(obj, pathStr) {
  const parts = pathStr.split(".");
  let cur = obj;
  for (const part of parts) {
    if (!cur || typeof cur !== "object" || !(part in cur)) return false;
    cur = cur[part];
  }
  return true;
}

function diffKeySets(allKeys, langKeys) {
  const missing = [];
  const extra = [];
  for (const k of allKeys) {
    if (!langKeys.has(k)) missing.push(k);
  }
  for (const k of langKeys) {
    if (!allKeys.has(k)) extra.push(k);
  }
  return { missing, extra };
}

function report(errors, label, items) {
  if (items.length === 0) return;
  errors.push(`${label} (${items.length})`);
  for (const item of items) errors.push(`  - ${item}`);
}

const errors = [];

// Load locales
const languages = listDirs(LOCALES_DIR);
if (languages.length === 0) {
  console.error("No locales found.");
  process.exit(1);
}

const ui = {};
const content = {};
for (const lang of languages) {
  const uiPath = path.join(LOCALES_DIR, lang, "ui.json");
  const contentPath = path.join(LOCALES_DIR, lang, "content.json");
  ui[lang] = readJson(uiPath);
  content[lang] = readJson(contentPath);
}

// UI key parity
const uiKeysByLang = new Map(languages.map((lang) => [lang, new Set(Object.keys(ui[lang]))]));
const allUiKeys = new Set();
for (const lang of languages) {
  for (const key of uiKeysByLang.get(lang)) allUiKeys.add(key);
}
for (const lang of languages) {
  const { missing, extra } = diffKeySets(allUiKeys, uiKeysByLang.get(lang));
  report(errors, `UI keys missing in ${lang}`, missing);
  report(errors, `UI keys extra in ${lang}`, extra);
}

// Content top-level parity + items parity
const contentKeysByLang = new Map(
  languages.map((lang) => [lang, new Set(Object.keys(content[lang]))]),
);
const allContentKeys = new Set();
for (const lang of languages) {
  for (const key of contentKeysByLang.get(lang)) allContentKeys.add(key);
}
for (const lang of languages) {
  const { missing, extra } = diffKeySets(allContentKeys, contentKeysByLang.get(lang));
  report(errors, `Content top-level keys missing in ${lang}`, missing);
  report(errors, `Content top-level keys extra in ${lang}`, extra);
}

const itemKeysByLang = new Map(
  languages.map((lang) => [
    lang,
    new Set(Object.keys((content[lang] && content[lang].items) || {})),
  ]),
);
const allItemKeys = new Set();
for (const lang of languages) {
  for (const key of itemKeysByLang.get(lang)) allItemKeys.add(key);
}
for (const lang of languages) {
  const { missing, extra } = diffKeySets(allItemKeys, itemKeysByLang.get(lang));
  report(errors, `Content items missing in ${lang}`, missing);
  report(errors, `Content items extra in ${lang}`, extra);
}

// Content consistency checks (use en as reference if present)
const refLang = languages.includes("en") ? "en" : languages[0];
for (const itemId of allItemKeys) {
  const refItem = (content[refLang].items || {})[itemId] || {};

  if (Array.isArray(refItem.option_ids)) {
    const refOptionIds = refItem.option_ids;
    for (const lang of languages) {
      const item = (content[lang].items || {})[itemId] || {};
      if (JSON.stringify(item.option_ids) !== JSON.stringify(refOptionIds)) {
        errors.push(`option_ids mismatch for ${itemId} in ${lang}`);
      }
      if (
        item.answer_correct_id &&
        Array.isArray(item.option_ids) &&
        !item.option_ids.includes(item.answer_correct_id)
      ) {
        errors.push(`answer_correct_id not in option_ids for ${itemId} in ${lang}`);
      }
    }
  }

  if (refItem.answer_correct_indices) {
    const refIndices = refItem.answer_correct_indices;
    for (const lang of languages) {
      const item = (content[lang].items || {})[itemId] || {};
      if (JSON.stringify(item.answer_correct_indices) !== JSON.stringify(refIndices)) {
        errors.push(`answer_correct_indices mismatch for ${itemId} in ${lang}`);
      }
    }
  }

  if (Array.isArray(refItem.pairs_left)) {
    for (const lang of languages) {
      const item = (content[lang].items || {})[itemId] || {};
      const left = item.pairs_left;
      const right = item.pairs_right;
      if (Array.isArray(left) && Array.isArray(right) && left.length !== right.length) {
        errors.push(`pairs_left/right length mismatch for ${itemId} in ${lang}`);
      }
    }
  }
}

// Code usage check
const tsxFiles = walkFiles(SRC_DIR, (p) => p.endsWith(".tsx"));
const usedKeys = new Set();
const usedTransKeys = new Set();
for (const file of tsxFiles) {
  const contentStr = fs.readFileSync(file, "utf8");
  const reSingle = /\bt\(\s*'([^']+)'/g;
  const reDouble = /\bt\(\s*"([^"]+)"/g;
  const reTrans = /<Trans[^>]*i18nKey="([^"]+)"/g;
  let m;
  while ((m = reSingle.exec(contentStr))) usedKeys.add(m[1]);
  while ((m = reDouble.exec(contentStr))) usedKeys.add(m[1]);
  while ((m = reTrans.exec(contentStr))) usedTransKeys.add(m[1]);
}

for (const key of usedKeys) {
  if (key.startsWith("content:")) {
    const pathStr = key.slice("content:".length);
    if (!hasPath(content[refLang], pathStr)) {
      errors.push(`Missing content key: ${key}`);
    }
    continue;
  }

  if (key.includes(":")) {
    const [ns, k] = key.split(":");
    if (ns === "ui") {
      if (!uiKeysByLang.get(refLang).has(k)) {
        errors.push(`Missing ui key: ${key}`);
      }
    } else if (ns === "content") {
      if (!hasPath(content[refLang], k)) {
        errors.push(`Missing content key: ${key}`);
      }
    } else {
      errors.push(`Unknown namespace: ${key}`);
    }
    continue;
  }

  if (!uiKeysByLang.get(refLang).has(key)) {
    errors.push(`Missing ui key: ${key}`);
  }
}

for (const key of usedTransKeys) {
  if (key.startsWith("content:")) {
    const pathStr = key.slice("content:".length);
    if (!hasPath(content[refLang], pathStr)) {
      errors.push(`Missing content key (Trans): ${key}`);
    }
  } else if (!uiKeysByLang.get(refLang).has(key)) {
    errors.push(`Missing ui key (Trans): ${key}`);
  }
}

if (errors.length) {
  console.error("i18n validation failed:");
  for (const err of errors) console.error(err);
  process.exit(1);
}

console.log("i18n validation passed.");
