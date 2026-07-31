import { useEffect, useState, useCallback } from "react";

export interface ToastData {
  id: string;
  message: string;
  type: "success" | "error";
}

interface ToastItemProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onRemove(toast.id), 400);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-400 ease-out ${
        leaving
          ? "opacity-0 -translate-y-3 scale-95"
          : visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-3 scale-95"
      } ${
        isSuccess
          ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
          : "bg-red-500/15 border-red-500/25 text-red-400"
      }`}
    >
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        <i className={`text-base ${isSuccess ? "ri-checkbox-circle-fill" : "ri-error-warning-fill"}`}></i>
      </div>
      <span className="text-sm font-medium whitespace-nowrap">{toast.message}</span>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
};

let toastCounter = 0;
let globalAddToast: ((message: string, type: "success" | "error") => void) | null = null;

export function showToast(message: string, type: "success" | "error" = "success") {
  if (globalAddToast) {
    globalAddToast(message, type);
  } else {
    console.warn("Toast not initialized — wrap your app with <ToastProvider>");
  }
}

export function useToastManager() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    globalAddToast = addToast;
    return () => {
      globalAddToast = null;
    };
  }, [addToast]);

  return { toasts, removeToast };
}

export default ToastContainer;