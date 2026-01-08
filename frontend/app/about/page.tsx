
import React from 'react';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">About Product Explorer</h1>
            <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                    Welcome to the <strong>Product Data Explorer</strong>, a powerful platform designed to navigate and analyze product usage from various sources.
                </p>
                <p className="mb-4">
                    Our mission is to provide transparent, accessible data about books and media. This project serves as a demonstration of a modern full-stack application leveraging:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Next.js</strong> for a responsive, server-side rendered frontend.</li>
                    <li><strong>NestJS</strong> for a robust, scalable backend architecture.</li>
                    <li><strong>Playwright</strong> for advanced, dynamic web scraping.</li>
                    <li><strong>PostgreSQL & Redis</strong> for reliable data persistence and caching.</li>
                </ul>
                <p>
                    Built with passion by the engineering team.
                </p>
            </div>
        </div>
    );
}
