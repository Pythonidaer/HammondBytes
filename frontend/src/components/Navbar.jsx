import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-[#0a0a23] text-white h-[50px] fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-end h-full space-x-3 sm:space-x-6">
          <Link
            to="/"
            className="text-white hover:text-white/80 transition-colors"
          >
            Home
          </Link>
          <a
            href="https://github.com/Pythonidaer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 transition-colors hidden sm:inline-block"
          >
            GitHub
          </a>
          <a
            href="https://jonathan-hammond.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 transition-colors hidden sm:inline-block"
          >
            Portfolio
          </a>
          <a
            href="https://www.linkedin.com/in/jonamichahammo/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 transition-colors"
          >
            LinkedIn
          </a>
          <Link
            to="/posts"
            className="btn-nav-inverse"
          >
            Blog
          </Link>
        </div>
      </div>
    </nav>
  );
}
