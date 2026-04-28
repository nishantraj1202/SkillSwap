"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[2000] flex flex-col gap-3 max-w-[400px] w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-2xl animate-in slide-in-from-right-full duration-300 ${
              toast.type === "success" 
                ? "bg-[#0D1A14] border-[#4ADE80]/20 text-[#4ADE80]" 
                : toast.type === "error"
                ? "bg-[#1A0D0D] border-[#F87171]/20 text-[#F87171]"
                : toast.type === "warning"
                ? "bg-[#1A1A0D] border-[#FBBF24]/20 text-[#FBBF24]"
                : "bg-[#1A1F35] border-[#6C63FF]/20 text-[#F0F2FF]"
            }`}
          >
            <div className="shrink-0">
              {toast.type === "success" && <CheckCircle2 size={20} />}
              {toast.type === "error" && <AlertCircle size={20} />}
              {toast.type === "warning" && <AlertCircle size={20} />}
              {toast.type === "info" && <Info size={20} />}
            </div>
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
