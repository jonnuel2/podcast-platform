"use client";

import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/assets/images/logo.png"
              alt="Shel-PodVault"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/browse" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Browse Podcasts
            </Link>
            <Link href="/creator" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              For Creators
            </Link>
            <Link href="/listener" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              My Library
            </Link>
          </div>

          {/* Wallet button removed - focusing on core functionality */}
          <div className="text-sm text-gray-500 italic">
            Wallet connection coming soon
          </div>
        </div>
      </div>
    </nav>
  );
}