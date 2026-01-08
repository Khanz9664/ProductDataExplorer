
import React from 'react';

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Contact Us</h1>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <p className="text-lg text-gray-700 mb-6">
                    Have questions or feedback? We'd love to hear from you.
                </p>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-900">Email</h3>
                        <p className="text-blue-600">shahid9664@gmail.com</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Twitter</h3>
                        <p className="text-blue-600">@Shaddy9664</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">GitHub</h3>
                        <p className="text-blue-600">github.com/khanz9664/product-explorer</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
