import { useContext } from "react";
import { SettingsContext, type SettingsContextValue } from "./context";

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings debe utilizarse dentro de SettingsProvider");
  }
  return context;
}
