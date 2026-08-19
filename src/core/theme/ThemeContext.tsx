import {
  type PropsWithChildren,
  type ReactElement,
  useEffect,
  useState,
} from "react";
import { db } from "../ipc";
import { ThemeContext, type ThemeMode } from "./context";

const DEFAULT_MODE: ThemeMode = "light";
const DEFAULT_ACCENT = "#8B5CF6";

function normalizeMode(value: string | null): ThemeMode {
  return value === "dark" ? "dark" : DEFAULT_MODE;
}

function applyTheme(mode: ThemeMode, accentColor: string): void {
  const root = document.documentElement;
  const isDark = mode === "dark";
  root.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark", isDark);
  root.dataset.theme = mode;
  root.style.setProperty("--color-primary", accentColor);
  root.style.setProperty("--accent-color", accentColor);
  root.style.setProperty("--bg-app", mode === "dark" ? "#020617" : "#FFFFFF");
  root.style.setProperty("--bg-card", mode === "dark" ? "#0f172a" : "#F8FAFC");
  root.style.setProperty(
    "--text-primary",
    mode === "dark" ? "#F1F5F9" : "#0F172A",
  );
  root.style.setProperty(
    "--text-secondary",
    mode === "dark" ? "#94A3B8" : "#64748B",
  );
}

export function ThemeProvider({ children }: PropsWithChildren): ReactElement {
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);
  const [accentColor, setAccentColorState] = useState(DEFAULT_ACCENT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadTheme(): Promise<void> {
      const [storedMode, storedAccent] = await Promise.all([
        db.getSetting("theme_mode"),
        db.getSetting("accent_color"),
      ]);

      if (active) {
        setModeState(normalizeMode(storedMode));
        setAccentColorState(storedAccent || DEFAULT_ACCENT);
        setIsLoading(false);
      }
    }

    void loadTheme();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    applyTheme(mode, accentColor);
  }, [mode, accentColor]);

  async function setMode(nextMode: ThemeMode): Promise<void> {
    setModeState(nextMode);
    await db.setSetting("theme_mode", nextMode);
  }

  async function setAccentColor(nextColor: string): Promise<void> {
    setAccentColorState(nextColor);
    await db.setSetting("accent_color", nextColor);
  }

  return (
    <ThemeContext.Provider
      value={{ mode, accentColor, isLoading, setMode, setAccentColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
