import { Skeleton } from "@/components/ui/skeleton";

export function BlogSectionSkeleton() {
    return (
        <div className="container mx-auto px-4 py-16">
            <Skeleton className="h-12 w-48 mx-auto mb-8 bg-neutral-800" />
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-[400px] w-full bg-neutral-800 rounded-lg" />
                    <Skeleton className="h-8 w-3/4 bg-neutral-800" />
                </div>
                <div className="flex flex-col gap-6 lg:w-[450px]">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="w-[195px] h-[110px] bg-neutral-800 rounded-md" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full bg-neutral-800" />
                                <Skeleton className="h-4 w-1/2 bg-neutral-800" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}