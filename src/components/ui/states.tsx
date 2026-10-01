import Link from 'next/link';
import { AlertCircle, Compass, RefreshCw, SearchX } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Skeletons                                                           */
/* ------------------------------------------------------------------ */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-md', className)} aria-hidden="true" />;
}

export function DestinationCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export function DestinationGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading destinations"
    >
      {Array.from({ length: count }).map((_, index) => (
        <DestinationCardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading destinations…</span>
    </div>
  );
}

export function TripCardSkeleton() {
  return (
    <div className="card p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-6 w-2/3" />
      <Skeleton className="mt-4 h-3 w-1/2" />
      <div className="mt-5 flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading destination" className="space-y-8">
      <Skeleton className="h-[46vh] min-h-[320px] w-full" />
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
      <span className="sr-only">Loading destination details…</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty and error states                                              */
/* ------------------------------------------------------------------ */

type StateIcon = typeof Compass;

interface StateShellProps {
  icon?: StateIcon;
  title: string;
  description: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  tone?: 'neutral' | 'error';
  className?: string;
}

function StateShell({
  icon: Icon = Compass,
  title,
  description,
  action,
  secondaryAction,
  tone = 'neutral',
  className,
}: StateShellProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center',
        tone === 'error' ? 'border-danger-500/30 bg-danger-50/50' : 'border-sand-300 bg-sand-50/60',
        className,
      )}
    >
      <span
        className={cn(
          'mb-4 flex h-12 w-12 items-center justify-center rounded-full',
          tone === 'error' ? 'bg-danger-100 text-danger-500' : 'bg-sand-200 text-maroon-700',
        )}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-charcoal-muted">{description}</p>
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

export function EmptyState(props: StateShellProps) {
  return <StateShell {...props} />;
}

export function NoResultsState({
  query,
  onClear,
  onReset,
}: {
  query: string;
  onClear?: () => void;
  onReset?: () => void;
}) {
  return (
    <StateShell
      icon={SearchX}
      title={query ? `No results for “${query}”` : 'No results found'}
      description="Try a broader search, remove a filter, or search by dynasty, ruler or period — for example “Mughal”, “Chalukya” or “Xuanzang”."
      action={
        onClear ? (
          <button type="button" className="btn-primary" onClick={onClear}>
            Clear search
          </button>
        ) : undefined
      }
      secondaryAction={
        onReset ? (
          <button type="button" className="btn-secondary" onClick={onReset}>
            Reset all filters
          </button>
        ) : undefined
      }
    />
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. This is usually temporary.',
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <StateShell
      icon={AlertCircle}
      tone="error"
      title={title}
      description={description}
      className={className}
      action={
        onRetry ? (
          <button type="button" className="btn-primary" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
        ) : undefined
      }
      secondaryAction={
        <Link href="/" className="btn-secondary">
          Back to home
        </Link>
      }
    />
  );
}

export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="You appear to be offline"
      description="Check your internet connection and try again. Saved places and trips are kept on your device until the connection returns."
      onRetry={onRetry}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Badges                                                              */
/* ------------------------------------------------------------------ */

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'accent' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}) {
  const tones = {
    neutral: 'bg-sand-100 text-charcoal-soft border-sand-200',
    accent: 'bg-saffron-50 text-saffron-800 border-saffron-200',
    primary: 'bg-maroon-50 text-maroon-800 border-maroon-200',
    success: 'bg-success-50 text-success-700 border-success-500/25',
    warning: 'bg-saffron-50 text-saffron-800 border-saffron-300',
    danger: 'bg-danger-50 text-danger-700 border-danger-500/25',
    info: 'bg-info-50 text-info-700 border-info-500/25',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Marks a destination record whose text has not yet been checked against its
 * cited sources. Rendered wherever historical content appears.
 */
export function VerificationBadge({
  verification,
  className,
}: {
  verification: 'verified' | 'unverified';
  className?: string;
}) {
  if (verification === 'verified') {
    return (
      <Badge tone="success" className={className}>
        Sources checked
      </Badge>
    );
  }
  return (
    <Badge tone="warning" className={className}>
      Draft record
    </Badge>
  );
}
