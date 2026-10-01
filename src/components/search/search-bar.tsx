'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import { kindLabel, suggest } from '@/lib/search/search-engine';
import { cn } from '@/lib/utils';
import type { SearchSuggestion } from '@/lib/types';

export function SearchBar({
  className,
  variant = 'hero',
  placeholder = 'Search places, monuments, cities, forts, temples…',
  autoFocus = false,
  initialValue = '',
  onNavigate,
}: {
  className?: string;
  variant?: 'hero' | 'navbar' | 'page' | 'icon';
  placeholder?: string;
  autoFocus?: boolean;
  initialValue?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [busy, setBusy] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // `useDeferredValue` keeps typing responsive while the scorer catches up.
  const deferredValue = useDeferredValue(value);
  const isStale = value !== deferredValue;

  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (deferredValue.trim().length < 2) return [];
    return suggest(DESTINATIONS, deferredValue, 8);
  }, [deferredValue]);

  // The spinner reflects the gap between the typed value and the scored one.
  useEffect(() => {
    if (isStale) setBusy(true);
  }, [isStale]);

  useEffect(() => {
    if (!isStale) setBusy(false);
  }, [isStale]);

  useEffect(() => {
    setActiveIndex(-1);
    setOpen(suggestions.length > 0 && deferredValue.trim().length >= 2);
  }, [deferredValue, suggestions.length]);

  // Close on an outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setValue('');
      onNavigate?.();
      router.push(href);
    },
    [onNavigate, router],
  );

  const submit = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      setOpen(false);
      onNavigate?.();
      router.push(`/destinations?q=${encodeURIComponent(trimmed)}`);
    },
    [onNavigate, router],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (suggestions.length === 0 ? -1 : (i + 1) % suggestions.length));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) =>
        suggestions.length === 0 ? -1 : i <= 0 ? suggestions.length - 1 : i - 1,
      );
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const active = activeIndex >= 0 ? suggestions[activeIndex] : undefined;
      if (active) go(active.href);
      else submit(value);
    }
  };

  if (variant === 'icon') {
    return (
      <span className="flex items-center">
        <Search className="h-5 w-5" aria-hidden="true" />
      </span>
    );
  }

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit(value);
        }}
        className="relative"
      >
        <label htmlFor={`${listboxId}-input`} className="sr-only">
          Search destinations, monuments, cities, dynasties and rulers
        </label>

        <div
          className={cn(
            'flex items-center gap-2.5 rounded-full border bg-white transition-all duration-200',
            isHero
              ? 'border-sand-300 px-5 py-3.5 shadow-card-hover focus-within:border-saffron-500 focus-within:ring-4 focus-within:ring-saffron-500/20'
              : 'border-sand-300 px-3.5 py-1.5 focus-within:border-saffron-500 focus-within:ring-2 focus-within:ring-saffron-500/25',
          )}
        >
          {busy || isStale ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-charcoal-muted" aria-hidden="true" />
          ) : (
            <Search
              className={cn('shrink-0 text-charcoal-muted', isHero ? 'h-5 w-5' : 'h-4 w-4')}
              aria-hidden="true"
            />
          )}

          <input
            ref={inputRef}
            id={`${listboxId}-input`}
            type="search"
            role="combobox"
            value={value}
            autoFocus={autoFocus}
            autoComplete="off"
            spellCheck={false}
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setOpen(suggestions.length > 0)}
            onKeyDown={onKeyDown}
            className={cn(
              'w-full min-w-0 bg-transparent text-charcoal placeholder:text-charcoal-muted/80 focus:outline-none',
              isHero ? 'text-base' : 'text-sm',
            )}
          />

          {value ? (
            <button
              type="button"
              onClick={() => {
                setValue('');
                inputRef.current?.focus();
              }}
              className="shrink-0 rounded-full p-1 text-charcoal-muted hover:bg-sand-100 hover:text-charcoal"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </form>

      {/* Suggestion list */}
      {open ? (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card-hover animate-fade-up"
          onMouseDown={(event) => event.preventDefault()}
        >
          <ul id={listboxId} role="listbox" aria-label="Search suggestions" className="max-h-96 overflow-y-auto py-1.5">
            {suggestions.map((item, index) => (
              <li key={item.id} role="none">
                <button
                  type="button"
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => go(item.href)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                    index === activeIndex ? 'bg-sand-100' : 'hover:bg-sand-50',
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-charcoal">
                      {item.label}
                    </span>
                    <span className="block truncate text-xs text-charcoal-muted">
                      {item.sublabel}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-sand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-charcoal-muted">
                    {kindLabel(item.kind)}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => submit(value)}
            className="flex w-full items-center gap-2 border-t border-sand-200 bg-sand-50 px-4 py-2.5 text-left text-xs font-semibold text-maroon-700 hover:bg-sand-100"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            See all results for “{value.trim()}”
          </button>
        </div>
      ) : null}

      {/*
        A live region so screen-reader users hear the result count as they type,
        which is otherwise conveyed only visually.
      */}
      <span className="sr-only" role="status" aria-live="polite">
        {open ? `${suggestions.length} suggestions available.` : ''}
      </span>
    </div>
  );
}
