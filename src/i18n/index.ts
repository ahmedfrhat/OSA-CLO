import enRaw from "./en.json";
import arRaw from "./ar.json";

export type Language = "en" | "ar";

type DeepRecord = { [key: string]: string | DeepRecord };

const translations: Record<Language, DeepRecord> = {
  en: enRaw as DeepRecord,
  ar: arRaw as DeepRecord,
};

/** Resolve a dot-notation key like "admin.login.title" from a nested object */
function resolve(obj: DeepRecord, path: string): string {
  const parts = path.split(".");
  let cur: string | DeepRecord = obj;
  for (const part of parts) {
    if (cur == null || typeof cur === "string") {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[i18n] Missing translation key: ${path}`);
      }
      return path;
    }
    cur = (cur as DeepRecord)[part];
  }
  if (typeof cur !== "string") {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[i18n] Missing translation key: ${path}`);
    }
    return path;
  }
  return cur;
}

/** Translate a dot-notation key into the target language */
export function translate(
  lang: Language,
  key: string,
  vars?: Record<string, string>
): string {
  let text = resolve(translations[lang], key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`{{${k}}}`, "g"), v);
    }
  }
  return text;
}
