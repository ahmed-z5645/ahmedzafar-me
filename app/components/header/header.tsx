"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="hidden lg:flex sticky top-8 z-50 backdrop-blur-md bg-[#F7F7F7]/40 dark:bg-[#1C1C1C]/40 rounded-xl px-10 lg:px-20 py-4 mb-10 justify-between items-center font-[family-name:var(--font-geist-mono)] text-[15px] shadow-sm border border-[#32404F]/10 dark:border-[#FAFCFD]/10 transition-colors w-full">
        <Link href="#experience" className="text-[#1E5B1A] dark:text-[#1E5B1A] transition-colors">Experience</Link>
        <Link href="/fun" className="text-[#32404F] dark:text-[#FAFCFD] hover:text-[#1E5B1A] dark:hover:text-[#1E5B1A] transition-colors">Fun</Link>
        <Link href="/about" className="text-[#32404F] dark:text-[#FAFCFD] hover:text-[#1E5B1A] dark:hover:text-[#1E5B1A] transition-colors">About</Link>
        <a href="/Ahmed_Zafar_Resume.pdf" className="text-[#32404F] dark:text-[#FAFCFD] hover:text-[#1E5B1A] dark:hover:text-[#1E5B1A] transition-colors">Resume</a>
      </nav>

      {/* =========================================
          MOBILE HEADER
          ========================================= */}
      <div className="lg:hidden fixed top-6 right-6 z-[100]">
        
        {/* Elegant Circular Glass Hamburger Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center w-12 h-12 backdrop-blur-md bg-[#FAFCFD]/80 dark:bg-[#1C1C1C]/80 rounded-full shadow-md border border-[#32404F]/10 dark:border-[#FAFCFD]/10 text-[#32404F] dark:text-[#FAFCFD] transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>

        {/* The Dropdown Menu */}
        {isMenuOpen && (
          <nav className="absolute top-16 right-0 flex flex-col backdrop-blur-xl bg-[#FAFCFD]/95 dark:bg-[#1C1C1C]/95 rounded-xl p-6 gap-6 font-[family-name:var(--font-geist-mono)] text-[15px] shadow-lg border border-[#32404F]/10 dark:border-[#FAFCFD]/10 text-right min-w-[200px]">
            <Link href="#experience" onClick={() => setIsMenuOpen(false)} className="text-[#1E5B1A] dark:text-[#1E5B1A]">Experience</Link>
            <Link href="/fun" onClick={() => setIsMenuOpen(false)} className="text-[#32404F] dark:text-[#FAFCFD] hover:text-[#1E5B1A] dark:hover:text-[#1E5B1A]">Fun</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-[#32404F] dark:text-[#FAFCFD] hover:text-[#1E5B1A] dark:hover:text-[#1E5B1A]">About</Link>
            <a href="/Ahmed_Zafar_Resume.pdf" onClick={() => setIsMenuOpen(false)} className="text-[#32404F] dark:text-[#FAFCFD] hover:text-[#1E5B1A] dark:hover:text-[#1E5B1A]">Resume</a>
          </nav>
        )}
      </div>
    </>
  );
}