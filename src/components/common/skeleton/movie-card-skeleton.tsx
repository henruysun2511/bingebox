"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function MovieCardSkeleton() {
  return (
    <div className="w-full">
      {/* Poster */}
      <Skeleton className="h-[320px] w-full rounded-xl bg-neutral-800" />

      {/* Badges */}
      <div className="flex gap-2 mt-3 flex-wrap">
        <Skeleton className="h-5 w-10 rounded bg-neutral-800" />
        <Skeleton className="h-5 w-16 rounded bg-neutral-800" />
        <Skeleton className="h-5 w-14 rounded bg-neutral-800" />
      </div>

      {/* Name */}
      <div className="mt-3 space-y-2">
        <Skeleton className="h-5 w-full bg-neutral-800" />
        <Skeleton className="h-5 w-3/4 bg-neutral-800" />
      </div>

      {/* Categories */}
      <Skeleton className="h-4 w-2/3 mt-2 bg-neutral-800" />
    </div>
  );
}