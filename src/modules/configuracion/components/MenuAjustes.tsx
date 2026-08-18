import { Archive, Palette, Settings, Type } from "lucide-react";
import type { ElementType } from "react";
import type { ConfigTab } from "../views/VistaConfiguracion";

interface MenuAjustesProps {
  activeTab: ConfigTab;
  onSelectTab: (tab: ConfigTab) => void;
}

export function MenuAjustes({ activeTab, onSelectTab }: MenuAjustesProps) {
  const menuItems: {
    id: ConfigTab;
    label: string;
    icon: ElementType;
    colorClass: string;
  }[] = [
    {
      id: "themes",
      label: "Temas",
      icon: Palette,
      colorClass:
        "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50",
    },
    {
      id: "spaces",
      label: "Espacios",
      icon: Archive,
      colorClass:
        "text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60",
    },
    {
      id: "general",
      label: "General",
      icon: Settings,
      colorClass:
        "text-blue-600 dark:text-blue-400 bg-blue-100/80 dark:bg-blue-950/60",
    },
    {
      id: "editor",
      label: "Editor",
      icon: Type,
      colorClass:
        "text-red-600 dark:text-red-400 bg-red-100/80 dark:bg-red-950/60",
    },
  ];

  return (
    <nav className="flex flex-col gap-1.5">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`group flex items-center gap-3 rounded-2xl p-2.5 text-left transition ${isActive ? "bg-slate-100 dark:bg-slate-800/80" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 ${item.colorClass}`}
            >
              <Icon size={16} />
            </span>
            <span
              className={`text-sm font-semibold ${isActive ? "text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
