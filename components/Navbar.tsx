"use client";

import Link from "next/link";
import Image from "next/image";
import { WalletButton } from "./WalletButton";

export function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/images/logo.png"
              alt="Shel-PodVault"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/browse"
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
            >
              Browse Podcasts
            </Link>
            <Link
              href="/creator"
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
            >
              For Creators
            </Link>
            <Link
              href="/listener"
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
            >
              My Library
            </Link>
          </div>

          {/* Wallet Button */}
          <div className="flex items-center">
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}