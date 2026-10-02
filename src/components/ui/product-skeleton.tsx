import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="group relative flex flex-col bg-white border border-black/5 overflow-hidden">
      {/* Image Area Skeleton */}
      <div className="relative aspect-[4/5] w-full bg-luxury-offwhite p-8 flex items-center justify-center overflow-hidden">
        <Skeleton className="w-full h-full bg-black/5 rounded-none" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-6 font-sans">
        <Skeleton className="h-3 w-16 bg-black/5 mb-2 rounded-none" /> {/* Brand */}
        <Skeleton className="h-6 w-3/4 bg-black/5 mb-4 rounded-none" /> {/* Title */}

        {/* Specs Skeleton */}
        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          <Skeleton className="h-5 w-12 bg-black/5 rounded-none" />
          <Skeleton className="h-5 w-10 bg-black/5 rounded-none" />
        </div>

        {/* Price & Action Skeleton */}
        <div className="flex items-end justify-between mt-auto pt-6 border-t border-black/5">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-24 bg-black/5 rounded-none" />
            <Skeleton className="h-3 w-16 bg-black/5 rounded-none" />
          </div>

          <Skeleton className="w-10 h-10 bg-black/5 rounded-none" />
        </div>
      </div>
    </div>
  );
}
