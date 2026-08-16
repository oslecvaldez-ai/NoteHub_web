import { useEffect, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { X } from "../../../core/components/Iconos";

export interface ContextMenuItem {
  id: string;
  label: string;
  destructive?: boolean;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface MenuContextualProps {
  isOpen: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

function getMenuRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  let root = document.getElementById("menu-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "menu-root";
    document.body.appendChild(root);
  }
  return root;
}

export function MenuContextual({
  isOpen,
  x,
  y,
  items,
  onClose,
}: MenuContextualProps): ReactElement | null {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const root = getMenuRoot();
  if (!root) return null;

  return createPortal(
    <div
      className="notas-context-menu"
      onClick={(event) => event.stopPropagation()}
      style={{ left: x, top: y }}
    >
      <button
        aria-label="Cerrar menú"
        className="notas-context-close"
        onClick={onClose}
        type="button"
      >
        <X size={14} />
      </button>
      {items.map((item) => (
        <button
          className={item.destructive ? "is-destructive" : undefined}
          key={item.id}
          onClick={() => {
            item.onSelect();
            onClose();
          }}
          type="button"
        >
          <span className="flex items-center gap-2.5">
            {item.icon ? (
              <span className="flex h-4 w-4 items-center justify-center">
                {item.icon}
              </span>
            ) : null}
            <span>{item.label}</span>
          </span>
        </button>
      ))}
    </div>,
    root,
  );
}
