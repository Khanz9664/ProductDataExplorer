import Link from 'next/link';

async function getProduct(id: string) {
    const res = await fetch(`http://localhost:3000/products/${id}`, { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}

async function refreshProduct(id: string) {
    'use server';
    await fetch(`http://localhost:3000/products/${id}/refresh`, { method: 'POST' });
}

import ProductHistoryTracker from '@/components/ProductHistoryTracker';
import RecentlyViewed from '@/components/RecentlyViewed';

import PageTransition from '@/components/PageTransition';

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);

    if (!product) {
        return <div className="p-10 text-center text-xl">Product not found.</div>;
    }

    return (
        <PageTransition>
            <main className="max-w-7xl mx-auto py-10 px-4">
                <ProductHistoryTracker productId={product.id} />

                <Link href={`/category/${product.category?.slug}`} className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block">&larr; Back to Category</Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] relative">
                        {product.imageUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={product.imageUrl} alt={product.title} className="object-contain w-full h-full" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                        )}
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                        <p className="text-2xl text-indigo-600 font-bold mb-6">{product.price}</p>

                        <div className="flex items-center gap-2 mb-4">
                            {product.details?.ratingsAvg ? (
                                <div className="flex items-center text-yellow-500">
                                    <span className="text-xl font-bold">{product.details.ratingsAvg}</span>
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                </div>
                            ) : null}
                            {product.details?.reviewsCount ? (
                                <span className="text-sm text-gray-500">({product.details.reviewsCount} reviews)</span>
                            ) : null}
                        </div>

                        <div className="prose max-w-none text-gray-700 mb-8">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p dangerouslySetInnerHTML={{ __html: product.details?.description || "No description available yet." }}></p>
                        </div>

                        {product.details?.specs && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                                <div className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                                    <table className="w-full text-left">
                                        <tbody>
                                            {Object.entries(product.details.specs)
                                                .filter(([key]) => key !== 'Recommendations')
                                                .map(([key, value]) => (
                                                    <tr key={key} className="border-b last:border-0 border-gray-200">
                                                        <th className="py-2 pr-4 font-medium text-gray-600 align-top w-1/3">{key}</th>
                                                        <td className="py-2 text-gray-800 align-top">{String(value)}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {product.details?.specs && (product.details.specs as any)['Recommendations'] && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">You might also like</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {(product.details.specs as any)['Recommendations'].map((rec: any, i: number) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-3 flex flex-col">
                                            <div className="aspect-[3/4] bg-gray-100 relative mb-2">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                {rec.image && <img src={rec.image} alt={rec.title} className="object-contain w-full h-full" />}
                                            </div>
                                            <h4 className="font-medium text-sm line-clamp-2 mb-1">{rec.title}</h4>
                                            <p className="text-indigo-600 font-bold text-sm mt-auto">{rec.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                Buy on World of Books
                            </a>

                            {/* Simple form action to refresh data */}
                            <form action={async () => {
                                'use server';
                                await fetch(`http://localhost:3000/products/${params.id}/refresh`, { method: 'POST' });
                            }}>
                                <button type="submit" className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                                    Refresh Data
                                </button>
                            </form>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Scraped at: {new Date(product.lastScrapedAt).toLocaleString()}</p>
                    </div>
                </div>

                <RecentlyViewed />
            </main>
        </PageTransition>
    );
}
