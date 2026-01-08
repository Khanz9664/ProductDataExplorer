
export default function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-24 bg-gray-200 rounded w-full"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                </div>
            </div>
        </div>
    );
}
