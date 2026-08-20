import {
  type PropsWithChildren,
  type ReactElement,
  useEffect,
  useState,
} from "react";
import { db } from "../ipc";
import {
  EditorSettingsContext,
  type EditorFontFamily,
  type EditorSettings,
} from "./context";

const STORAGE_KEY = "notehub-editor-settings";
const DEFAULT_SETTINGS: EditorSettings = {
  fontFamily: "system",
  fontSize: 16,
  lineHeight: 1.5,
  paragraphSpacing: 4,
};

function readStoredSettings(): EditorSettings {
  if (typeof localStorage === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return {
      ...DEFAULT_SETTINGS,
      ...(stored && typeof stored === "object" ? stored : {}),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function normalizeFontFamily(value: string | null): EditorFontFamily {
  if (value === "Serif" || value === "serif") return "serif";
  if (value === "Monospace" || value === "monospace") return "monospace";
  return "system";
}

export function EditorSettingsProvider({
  children,
}: PropsWithChildren): ReactElement {
  const [settings, setSettings] = useState<EditorSettings>(readStoredSettings);

  useEffect(() => {
    void Promise.all([
      db.getSetting("font_family"),
      db.getSetting("font_size"),
      db.getSetting("line_spacing"),
      db.getSetting("paragraph_spacing"),
    ]).then(([fontFamily, fontSize, lineHeight, paragraphSpacing]) => {
      setSettings((current) => ({
        ...current,
        ...(fontFamily ? { fontFamily: normalizeFontFamily(fontFamily) } : {}),
        ...(fontSize !== null ? { fontSize: Number(fontSize) } : {}),
        ...(lineHeight !== null ? { lineHeight: Number(lineHeight) } : {}),
        ...(paragraphSpacing !== null
          ? { paragraphSpacing: Number(paragraphSpacing) }
          : {}),
      }));
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const update = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K],
  ): void => {
    setSettings((current) => ({ ...current, [key]: value }));
    const databaseKey =
      key === "fontFamily"
        ? "font_family"
        : key === "fontSize"
          ? "font_size"
          : key === "lineHeight"
            ? "line_spacing"
            : "paragraph_spacing";
    void db.setSetting(databaseKey, String(value));
  };

  return (
    <EditorSettingsContext.Provider
      value={{
        ...settings,
        setFontFamily: (value) => update("fontFamily", value),
        setFontSize: (value) => update("fontSize", value),
        setLineHeight: (value) => update("lineHeight", value),
        setParagraphSpacing: (value) => update("paragraphSpacing", value),
      }}
    >
      {children}
    </EditorSettingsContext.Provider>
  );
}
