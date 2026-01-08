
'use client';

import Link from 'next/link';
import { useHistory } from '@/hooks/useHistory';

export default function RecentlyViewed() {
    const { history, isLoading } = useHistory();

    if (isLoading) return <div className="py-8 text-center text-gray-400">Loading history...</div>;
    if (!history || history.length === 0) return null;

    return (
        <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {history.map((item: any) => (
                    <Link href={`/product/${item.product.sourceId}`} key={item.id} className="group block">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                            {item.product.imageUrl && (
                                <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-32 object-cover" />
                            )}
                            <div className="p-3">
                                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 truncate">{item.product.title}</h3>
                                <p className="text-gray-500 text-sm">{item.product.price}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
