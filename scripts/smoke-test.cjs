const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const LOCALES_DIR = path.join(ROOT, "client", "src", "locales");
const I18N_CONFIG = path.join(ROOT, "client", "src", "i18n", "config.ts");

function assert(condition, message) {
  if (!condition) {
    console.error(`Smoke test failed: ${message}`);
    process.exit(1);
  }
}

assert(fs.existsSync(LOCALES_DIR), "locales directory missing");
assert(fs.existsSync(I18N_CONFIG), "i18n config missing");

const requiredLangs = ["en", "ru", "lv"];
for (const lang of requiredLangs) {
  const langDir = path.join(LOCALES_DIR, lang);
  assert(fs.existsSync(langDir), `locale missing: ${lang}`);
  assert(fs.existsSync(path.join(langDir, "ui.json")), `ui.json missing: ${lang}`);
  assert(fs.existsSync(path.join(langDir, "content.json")), `content.json missing: ${lang}`);
}

const i18nConfig = fs.readFileSync(I18N_CONFIG, "utf8");
for (const lang of requiredLangs) {
  assert(
    i18nConfig.includes(`'${lang}'`) || i18nConfig.includes(`"${lang}"`),
    `i18n config missing language: ${lang}`,
  );
}

console.log("Smoke test passed.");
