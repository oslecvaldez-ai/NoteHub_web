import { createContext } from "react";

export type EditorFontFamily = "system" | "serif" | "monospace";

export interface EditorSettings {
  fontFamily: EditorFontFamily;
  fontSize: number;
  lineHeight: number;
  paragraphSpacing: number;
}

export interface EditorSettingsContextValue extends EditorSettings {
  setFontFamily: (value: EditorFontFamily) => void;
  setFontSize: (value: number) => void;
  setLineHeight: (value: number) => void;
  setParagraphSpacing: (value: number) => void;
}

export const EditorSettingsContext = createContext<
  EditorSettingsContextValue | undefined
>(undefined);
