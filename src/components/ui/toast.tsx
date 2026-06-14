import React, { createContext, useContext, useState, useCallback } from "react";

type Variant = "info" | "warning" | "error" | "success";
type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastOptions = {
  message: string;
  variant?: Variant;
  duration?: number; // ms
  position?: Position;
};

type Toast = ToastOptions & { id: string };

type ToastContextValue = {
  showToast: (opts: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function useId() {
  return Math.random().toString(36).slice(2, 9);
}

function variantClasses(v: Variant) {
  switch (v) {
    case "warning":
      return "bg-yellow-400 text-black";
    case "error":
      return "bg-red-500 text-white";
    case "success":
      return "bg-green-500 text-white";
    case "info":
    default:
      return "bg-blue-500 text-white";
  }
}

function positionContainerClass(pos: Position) {
  switch (pos) {
    case "top-left":
      return "top-4 left-4 items-start";
    case "top-center":
      return "top-4 left-1/2 transform -translate-x-1/2 items-center";
    case "top-right":
      return "top-4 right-4 items-end";
    case "bottom-left":
      return "bottom-4 left-4 items-start";
    case "bottom-center":
      return "bottom-4 left-1/2 transform -translate-x-1/2 items-center";
    case "bottom-right":
      return "bottom-4 right-4 items-end";
  }
}

export const ToastProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback(
    (opts: ToastOptions) => {
      const id = useId();
      const toast: Toast = {
        id,
        message: opts.message,
        variant: opts.variant ?? "info",
        duration: opts.duration ?? 4000,
        position: opts.position ?? "bottom-right",
      };
      setToasts((t) => [toast, ...t]);
      if (toast.duration && toast.duration > 0) {
        window.setTimeout(() => remove(id), toast.duration);
      }
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div aria-live="polite" className="pointer-events-none">
        {(
          [
            "top-left",
            "top-center",
            "top-right",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ] as Position[]
        ).map((pos) => {
          const items = toasts.filter((t) => t.position === pos);
          if (items.length === 0) return null;
          return (
            <div
              key={pos}
              className={`fixed z-50 flex flex-col gap-3 ${positionContainerClass(pos)}`}
            >
              {items.map((t) => (
                <div
                  key={t.id}
                  className={`pointer-events-auto w-80 max-w-[90vw] rounded-md px-4 py-2 shadow ${variantClasses(
                    (t.variant as Variant) ?? "info",
                  )}`}
                >
                  <div className="text-sm">{t.message}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx.showToast;
}

export default ToastProvider;
