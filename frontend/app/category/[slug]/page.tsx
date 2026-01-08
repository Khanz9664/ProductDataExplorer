import Link from 'next/link';
import Image from 'next/image';

async function getCategory(slug: string) {
    const res = await fetch(`http://localhost:3000/categories/${slug}`, { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch category');
    return res.json();
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const category = await getCategory(params.slug);

    if (!category) {
        return <div className="p-10 text-center text-xl">Category not found.</div>;
    }

    return (
        <main className="max-w-7xl mx-auto py-10 px-4">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">&larr; Back to Categories</Link>
                    <h1 className="text-3xl font-bold">{category.title}</h1>
                </div>
                <form action={async () => {
                    'use server';
                    await fetch(`http://localhost:3000/categories/${params.slug}/refresh`, { method: 'POST' });
                }}>
                    <button type="submit" className="text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        Refresh Category
                    </button>
                </form>
            </div>

            {category.products.length === 0 ? (
                <p>No products found in this category.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {category.products.map((product: any) => (
                        <Link href={`/product/${product.id}`} key={product.id} className="block group">
                            <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow bg-white h-full flex flex-col">
                                <div className="aspect-[3/4] relative bg-gray-100">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.title} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h2 className="font-semibold text-gray-900 group-hover:text-indigo-600 mb-2 line-clamp-2">{product.title}</h2>
                                    <div className="mt-auto">
                                        <span className="text-lg font-bold text-gray-900">{product.price}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
