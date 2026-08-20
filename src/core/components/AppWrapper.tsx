import { type PropsWithChildren, type ReactElement } from "react";
import { ThemeProvider } from "../theme/ThemeContext";
import { EditorSettingsProvider } from "../editor-settings/EditorSettingsContext";
import { NotificationProvider } from "./NotificationContext";
import { NotificacionToast } from "./NotificacionToast";
import { SettingsProvider } from "../settings/SettingsContext";

export function AppWrapper({ children }: PropsWithChildren): ReactElement {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <EditorSettingsProvider>
          <NotificationProvider>
            {children}
            <NotificacionToast />
          </NotificationProvider>
        </EditorSettingsProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
