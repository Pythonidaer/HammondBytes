import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-20">
          <div className="text-center">
            <h1 className="fluid-title font-bold text-[#2a2a40] mb-4 sm:mb-6">
              Welcome to HammondBytes
            </h1>
            <p className="fluid-text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
              A blog about web development, software engineering, and my journey as a developer.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link
                to="/posts"
                className="inline-flex items-center px-6 py-3 bg-[#0a0a23] text-white font-medium rounded-lg hover:bg-[#2a2a40] transition-colors"
              >
                View Posts
              </Link>
              <a
                href="https://github.com/Pythonidaer"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                View GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
