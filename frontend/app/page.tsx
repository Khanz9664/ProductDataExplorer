import Link from 'next/link';

async function getCategories() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
  if (!res.ok) {
    // Graceful fallback or error handling
    console.error('Failed to fetch categories');
    return [];
  }
  return res.json();
}

export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="max-w-7xl mx-auto py-10 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          World of Books Explorer
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Discover thousands of books, music, and movies.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat: any) => (
          <Link href={`/category/${cat.slug}`} key={cat.id} className="block group">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-indigo-500 transition-all bg-white h-full flex items-center justify-center text-center">
              <h2 className="text-xl font-semibold group-hover:text-indigo-600 transition-colors">
                {cat.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
