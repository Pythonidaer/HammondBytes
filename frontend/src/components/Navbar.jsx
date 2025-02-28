import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrollIndicatorStyle, setScrollIndicatorStyle] = useState({
    backgroundSize: '0% 5px'
  });
  const location = useLocation();
  const isPostDetail = location.pathname.startsWith('/posts/');

  useEffect(() => {
    if (!isPostDetail) return;

    const updateScrollIndicator = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrolled = window.scrollY;
      const percentageScrolled = (scrolled / (documentHeight - windowHeight)) * 100;
      
      setScrollIndicatorStyle({
        backgroundSize: `${percentageScrolled}% 5px`
      });
    };

    window.addEventListener('scroll', updateScrollIndicator);
    updateScrollIndicator(); // Initial call

    return () => window.removeEventListener('scroll', updateScrollIndicator);
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
        <div 
          className="fixed top-[50px] left-0 w-full h-[5px] z-40"
          style={{
            background: 'linear-gradient(to right, #5400ff, #e4514f)',
            ...scrollIndicatorStyle,
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}
    </>
  );
}
