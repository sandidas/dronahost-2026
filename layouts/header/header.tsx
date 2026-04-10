"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* LEFT */}
          <div className="flex items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-800 dark:text-gray-100">drona</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">host</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              <Link href="/web-hosting" className="nav-link">Web Hosting</Link>
              <Link href="/wordpress" className="nav-link">Wordpress</Link>
              <Link href="/website-building" className="nav-link">Website Building</Link>
              <Link href="/ecommerce" className="nav-link">E commerce</Link>
              <Link href="/email-marketing" className="nav-link">Email Marketing</Link>
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-4">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              ☰
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Login
            </Link>

          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link href="/web-hosting" className="mobile-link">Web Hosting</Link>
              <Link href="/wordpress" className="mobile-link">Wordpress</Link>
              <Link href="/website-building" className="mobile-link">Website Building</Link>
              <Link href="/ecommerce" className="mobile-link">E commerce</Link>
              <Link href="/email-marketing" className="mobile-link">Email Marketing</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}