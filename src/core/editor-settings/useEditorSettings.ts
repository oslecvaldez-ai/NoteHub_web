import { useContext } from "react";
import { EditorSettingsContext } from "./context";

export function useEditorSettings() {
  const context = useContext(EditorSettingsContext);
  if (!context) {
    throw new Error(
      "useEditorSettings debe utilizarse dentro de EditorSettingsProvider",
    );
  }
  return context;
}
