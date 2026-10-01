'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose(): void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Set false for destructive flows that need an explicit choice. */
  dismissable?: boolean;
}

const SIZES = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' } as const;

/**
 * Accessible modal dialog.
 *
 * Implements the four things a dialog has to get right to be usable without a
 * mouse: focus moves in on open, Tab is trapped inside, Escape closes, and
 * focus returns to whatever opened it.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  dismissable = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Remember the trigger so focus can be restored on close.
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

    // Prefer the first real control; fall back to the panel itself.
    const [first] = focusables();
    (first ?? panel).focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dismissable) {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const firstItem = items[0]!;
      const lastItem = items[items.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && (active === firstItem || active === panel)) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && active === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus();
    };
  }, [dismissable, onClose, open]);

  // Guard against SSR: the portal needs a DOM.
  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-charcoal/50 backdrop-blur-sm"
        onClick={dismissable ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 max-h-[92vh] w-full animate-scale-in overflow-y-auto rounded-t-2xl bg-white shadow-card-hover focus:outline-none sm:rounded-2xl',
          SIZES[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-sand-200 p-5">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold text-charcoal">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm text-charcoal-muted">
                {description}
              </p>
            ) : null}
          </div>
          {dismissable ? (
            <button
              type="button"
              onClick={onClose}
              className="-m-1.5 shrink-0 rounded-lg p-1.5 text-charcoal-muted transition-colors hover:bg-sand-100 hover:text-charcoal"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="p-5">{children}</div>

        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-sand-200 bg-sand-50 p-5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

/** Confirmation dialog used before destructive actions. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  busy = false,
}: {
  open: boolean;
  onClose(): void;
  onConfirm(): void;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      dismissable={!busy}
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Working…' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-charcoal-soft">{message}</p>
    </Modal>
  );
}

/** Small hook for dialogs that need their own open/close state. */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v: boolean) => !v), []);
  return { isOpen, open, close, toggle, setIsOpen };
}
