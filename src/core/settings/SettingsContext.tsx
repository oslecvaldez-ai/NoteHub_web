import { type PropsWithChildren, type ReactElement, useState } from "react";
import { SettingsContext } from "./context";

const COLLAPSE_NOTEBOOKS_KEY = "notehub_settings_collapse_notebooks";

function readCollapsePreference(): boolean {
  if (typeof localStorage === "undefined") return false;
  const saved = localStorage.getItem(COLLAPSE_NOTEBOOKS_KEY);
  if (saved === null) return false;

  try {
    return JSON.parse(saved) === true;
  } catch {
    return false;
  }
}

export function SettingsProvider({
  children,
}: PropsWithChildren): ReactElement {
  const [collapseNotebooksByDefault, setCollapseNotebooksByDefault] = useState(
    readCollapsePreference,
  );

  const toggleCollapseNotebooksByDefault = (value: boolean): void => {
    setCollapseNotebooksByDefault(value);
    localStorage.setItem(COLLAPSE_NOTEBOOKS_KEY, JSON.stringify(value));
  };

  return (
    <SettingsContext.Provider
      value={{
        collapseNotebooksByDefault,
        toggleCollapseNotebooksByDefault,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
