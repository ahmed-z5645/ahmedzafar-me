"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="hidden lg:flex sticky top-8 z-50 backdrop-blur-md bg-glass/40 rounded-xl px-10 lg:px-20 py-4 mb-10 justify-between items-center font-[family-name:var(--font-geist-mono)] text-[15px] shadow-sm border border-foreground/10 transition-colors w-full">
        <Link href="#experience" className="text-accent transition-colors">Experience</Link>
        <Link href="/fun" className="text-foreground hover:text-accent transition-colors">Fun</Link>
        <Link href="/about" className="text-foreground hover:text-accent transition-colors">About</Link>
        <a href="/Ahmed_Zafar_Resume.pdf" className="text-foreground hover:text-accent transition-colors">Resume</a>
      </nav>

      {/* =========================================
          MOBILE HEADER
          ========================================= */}
      <div className="lg:hidden fixed top-6 right-6 z-[100]">
        
        {/* Elegant Circular Glass Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center w-12 h-12 backdrop-blur-md bg-surface/80 rounded-full shadow-md border border-foreground/10 text-foreground transition-colors"
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
          <nav className="absolute top-16 right-0 flex flex-col backdrop-blur-xl bg-surface/95 rounded-xl p-6 gap-6 font-[family-name:var(--font-geist-mono)] text-[15px] shadow-lg border border-foreground/10 text-right min-w-[200px]">
            <Link href="#experience" onClick={() => setIsMenuOpen(false)} className="text-accent">Experience</Link>
            <Link href="/fun" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-accent">Fun</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-accent">About</Link>
            <a href="/Ahmed_Zafar_Resume.pdf" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-accent">Resume</a>
          </nav>
        )}
      </div>
    </>
  );
}