import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center"> {/* This div now wraps the brand */}
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl text-indigo-600">Product Explorer</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center"> {/* This div holds the navigation links */}
                        <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
                        <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
                        <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
                        <Link href="/readme" className="text-gray-700 hover:text-blue-600 transition-colors">Help</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
