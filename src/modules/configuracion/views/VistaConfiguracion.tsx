import { useState } from "react";
import { MenuAjustes } from "../components/MenuAjustes";
import { SeccionEditor } from "../sections/SeccionEditor";
import { SeccionEspacios } from "../sections/SeccionEspacios";
import { SeccionGeneral } from "../sections/SeccionGeneral";
import { SeccionTemas } from "../sections/SeccionTemas";

export type ConfigTab = "themes" | "spaces" | "general" | "editor";

export function VistaConfiguracion() {
  const [activeTab, setActiveTab] = useState<ConfigTab>("themes");

  const renderSection = () => {
    switch (activeTab) {
      case "spaces":
        return <SeccionEspacios />;
      case "general":
        return <SeccionGeneral />;
      case "editor":
        return <SeccionEditor />;
      case "themes":
        return <SeccionTemas />;
    }
  };

  return (
    <div className="flex h-full w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-slate-50 dark:border-slate-800/60 dark:bg-slate-950">
        <div className="flex h-14 items-center border-b border-slate-100 px-4 dark:border-slate-800/80">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Ajustes
          </h2>
        </div>
        <div className="p-3">
          <MenuAjustes activeTab={activeTab} onSelectTab={setActiveTab} />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-slate-50 p-8 dark:bg-slate-950">
        <div className="mx-auto max-w-2xl">{renderSection()}</div>
      </main>
    </div>
  );
}
