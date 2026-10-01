'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  /** Optional single action, e.g. "Undo". */
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toast(input: Omit<Toast, 'id' | 'variant'> & { variant?: ToastVariant }): void;
  dismiss(id: string): void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof Info; className: string; iconClass: string }> = {
  success: {
    icon: CheckCircle2,
    className: 'border-success-500/30 bg-success-50 text-success-700',
    iconClass: 'text-success-500',
  },
  error: {
    icon: XCircle,
    className: 'border-danger-500/30 bg-danger-50 text-danger-700',
    iconClass: 'text-danger-500',
  },
  info: {
    icon: Info,
    className: 'border-info-500/30 bg-info-50 text-info-700',
    iconClass: 'text-info-500',
  },
  warning: {
    icon: TriangleAlert,
    className: 'border-saffron-500/40 bg-saffron-50 text-saffron-800',
    iconClass: 'text-saffron-600',
  },
};

const AUTO_DISMISS_MS = 5200;
const MAX_VISIBLE = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback<ToastContextValue['toast']>(
    (input) => {
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const next: Toast = {
        id,
        variant: input.variant ?? 'info',
        title: input.title,
        description: input.description,
        action: input.action,
      };

      setToasts((current) => [...current, next].slice(-MAX_VISIBLE));

      const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending.values()) clearTimeout(timer);
      pending.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [dismiss, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/*
        `polite` rather than `assertive`: toasts are confirmations of an action the
        user just took, so they should not interrupt whatever they are reading.
        Errors are announced through the same region but remain non-interrupting,
        which is appropriate because the user always initiated the action.
      */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
      >
        {toasts.map((item) => {
          const { icon: Icon, className, iconClass } = VARIANT_STYLES[item.variant];
          return (
            <div
              key={item.id}
              role="status"
              className={cn(
                'pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-xl border p-3.5 shadow-card-hover',
                className,
              )}
            >
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconClass)} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{item.title}</p>
                {item.description ? (
                  <p className="mt-0.5 text-sm text-charcoal-soft">{item.description}</p>
                ) : null}
                {item.action ? (
                  <button
                    type="button"
                    onClick={() => {
                      item.action?.onClick();
                      dismiss(item.id);
                    }}
                    className="mt-2 rounded-md text-sm font-semibold underline underline-offset-2 hover:opacity-80"
                  >
                    {item.action.label}
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="-m-1 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100"
                aria-label={`Dismiss notification: ${item.title}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>.');
  return context;
}
