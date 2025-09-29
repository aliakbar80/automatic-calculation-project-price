"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  effectiveTheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("theme") as Theme | null)) || "system";
    setTheme(saved);
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const effectiveTheme = useMemo<"light" | "dark">(() => (theme === "system" ? (systemDark ? "dark" : "light") : theme), [theme, systemDark]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", effectiveTheme === "dark");
    if (theme !== "system") localStorage.setItem("theme", theme);
    else localStorage.removeItem("theme");
  }, [theme, effectiveTheme]);

  const value = useMemo(() => ({ theme, setTheme, effectiveTheme }), [theme, effectiveTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
