import { DestinationGridSkeleton } from '@/components/ui/states';

/** Route-level loading state for the destination listing. */
export default function Loading() {
  return (
    <div className="container-page py-14">
      <div className="skeleton h-9 w-64" aria-hidden="true" />
      <div className="skeleton mt-3 h-4 w-96 max-w-full" aria-hidden="true" />
      <div className="mt-8">
        <DestinationGridSkeleton count={9} />
      </div>
    </div>
  );
}
