
import React from 'react';

export default function ReadmePage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">Help & Documentation</h1>

            <div className="space-y-8">
                <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-800">How to Use</h2>
                    <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                        <li><strong>Browse Categories</strong>: Use the navigation bar to visit different book categories.</li>
                        <li><strong>Scrape on Demand</strong>: If a category is empty or plain, the system can scrape fresh data from World of Books.</li>
                        <li><strong>View Products</strong>: Click on any product card to view detailed specifications, descriptions, and metadata.</li>
                    </ol>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-800">Scraping Logic</h2>
                    <p className="text-gray-700 mb-3">
                        This application uses a sophisticated <strong>Playwright</strong> scraper to fetch real-time data.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Concurrency</strong>: Multiple requests are handled safely using unique temporary storage.</li>
                        <li><strong>Respectful Scraping</strong>: We strictly adhere to `robots.txt` where applicable and use reasonable delays.</li>
                        <li><strong>Data Quality</strong>: We employ advanced selectors to separate promotional content from actual product descriptions.</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-800">Troubleshooting</h2>
                    <p className="text-gray-700">
                        If data is not loading, ensure the Backend Server is running on Port 3000 and the Database is active.
                        Check the `Scraped at` timestamp on products to see how fresh the data is.
                    </p>
                </section>
            </div>
        </div>
    );
}
