import React from "react";
import { CheckCircle2, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md p-6 relative flex flex-col items-center text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="w-5 h-5" />
        </button>
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          {title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};
