"use client";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { effectiveTheme, setTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "تغییر به روشن" : "تغییر به تیره"}
      className={`relative inline-flex h-8 w-16 items-center rounded-full border transition-colors
      ${isDark ? "bg-black border-zinc-800" : "bg-white border-zinc-300"}`}
    >
      <span
        className={`absolute inline-flex h-7 w-7 transform items-center justify-center rounded-full transition-transform
        ${isDark ? "-translate-x-8 bg-zinc-900 text-white" : "translate-x-1 bg-zinc-100 text-black"}`}
      >
        {!isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
    </button>
  );
}
