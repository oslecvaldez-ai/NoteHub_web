import { createContext } from "react";

export interface SettingsContextValue {
  collapseNotebooksByDefault: boolean;
  toggleCollapseNotebooksByDefault: (value: boolean) => void;
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);
