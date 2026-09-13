import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "es" | "en";

/** A piece of copy in both languages. */
export type Bilingual = { es: string; en: string };

const STORAGE_KEY = "vine-lang";
const DEFAULT_LANG: Lang = "es";

type Ctx = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Pick the current language from a pair: t("Hola", "Hello") or t({ es, en }). */
  t: {
    (es: string, en: string): string;
    (pair: Bilingual): string;
  };
};

const LanguageContext = createContext<Ctx | null>(null);

function readStored(): Lang | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "es" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Server and first client render both use the default so hydration matches;
  // the saved preference is applied right after mount.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = readStored();
    if (stored) setLangState(stored);
    else if (
      typeof navigator !== "undefined" &&
      !navigator.language.toLowerCase().startsWith("es")
    ) {
      setLangState("en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode etc. */
    }
  }, []);

  const value = useMemo<Ctx>(() => {
    const t = ((a: string | Bilingual, b?: string) =>
      typeof a === "string" ? (lang === "es" ? a : (b ?? a)) : a[lang]) as Ctx["t"];
    return { lang, setLang, t };
  }, [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}

/** Segmented ES / EN switch. */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  const base =
    "px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors";
  return (
    <div
      role="group"
      aria-label="Idioma / Language"
      className={`inline-flex border border-border bg-background/60 ${className}`}
    >
      {(["es", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={`${base} ${
            lang === code
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {code === "es" ? "ES" : "EN"}
        </button>
      ))}
    </div>
  );
}
