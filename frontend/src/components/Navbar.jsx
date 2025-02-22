import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-[#0a0a23] text-white h-[38px] fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-end h-full space-x-3 sm:space-x-6">
          <Link
            to="/"
            className="text-sm hover:text-[#99c9ff] transition-colors"
          >
            Home
          </Link>
          <a
            href="https://github.com/Pythonidaer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-[#99c9ff] transition-colors hidden sm:inline-block"
          >
            GitHub
          </a>
          <a
            href="https://portfolio.jonamichahammo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-[#99c9ff] transition-colors hidden sm:inline-block"
          >
            Portfolio
          </a>
          <a
            href="https://www.linkedin.com/in/jonamichahammo/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-[#99c9ff] transition-colors"
          >
            LinkedIn
          </a>
          <Link
            to="/posts"
            className="px-4 py-1 bg-white text-[#0a0a23] text-sm font-medium rounded hover:bg-[#99c9ff] transition-colors"
          >
            Blog
          </Link>
        </div>
      </div>
    </nav>
  );
}
