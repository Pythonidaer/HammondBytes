import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [progressWidth, setProgressWidth] = useState(0);
  const location = useLocation();
  const isPostDetail = location.pathname.startsWith('/posts/');

  useEffect(() => {
    if (!isPostDetail) return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollBottom = scrollTop + windowHeight;

      // If we're at the bottom (or past it), set to 100%
      if (scrollBottom >= documentHeight) {
        setProgressWidth(100);
        return;
      }

      // Calculate the progress percentage
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setProgressWidth(Math.min(100, Math.max(0, Math.round(progress))));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPostDetail]);

  return (
    <>
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
      {isPostDetail && (
        <div className="fixed top-[50px] left-0 w-full h-[5px] z-40 bg-transparent">
          <div
            className="h-full"
            style={{
              width: `${progressWidth}%`,
              background: 'linear-gradient(to right, #5400ff, #e4514f)',
              transition: 'width 0.2s ease-out'
            }}
          />
        </div>
      )}
    </>
  );
}
