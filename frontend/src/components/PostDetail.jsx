import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { strapiApi } from '../api/strapi';
import { useEffect, useState } from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { preprocessBlocks } from '../utils/contentTransforms';
import ErrorBoundary from './ErrorBoundary';

// Standard dimensions for detail view
const DETAIL_WIDTH = 1200;
const DETAIL_HEIGHT = 800; // 3:2 aspect ratio

const getOptimizedImageUrl = (url, width = DETAIL_WIDTH) => {
  if (!url) return '';
  if (url.startsWith('/')) {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:1337'}${url}`;
  }
  if (url.includes('cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0];
    const imagePath = url.split('/upload/')[1];
    return `${baseUrl}/upload/c_fill,w_${width},h_${Math.floor(width * 2/3)},q_auto,f_auto/${imagePath}`;
  }
  return url;
};

const getImageSrcSet = (url) => {
  if (!url || !url.includes('cloudinary.com')) return '';
  const widths = [400, 800, 1200, 1600];
  return widths
    .map(w => `${getOptimizedImageUrl(url, w)} ${w}w`)
    .join(', ');
};

export default function PostDetail() {
  const { id: slug } = useParams();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const response = await strapiApi.get(`/posts?filters[Slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
      const posts = response.data;
      
      if (!posts?.data?.[0]) {
        throw new Error('Post not found');
      }
      
      return { data: posts.data[0] };
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">Error loading post: {error.message}</div>;
  }

  if (!post?.data) {
    return (
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
        <Link to="/posts" className="text-[#002ead] hover:text-[#00471b]">
          ← Back to Posts
        </Link>
      </div>
    );
  }

  const postData = post.data;

  // Process the content blocks
  const processedContent = preprocessBlocks(postData.Content || []);

  return (
    <div className="bg-white">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post metadata */}
        <div className="mb-6">
          <span className="text-sm text-[#0066cc] uppercase font-medium tracking-wide">
            {new Date(postData.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>

        {/* Post title */}
        <h1 className="text-4xl font-bold text-[#2a2a40] mb-6 leading-tight">
          {postData.Title}
        </h1>

        {/* Author info */}
        <div className="flex items-center mb-8">
          <img src="/profile_pic.png" alt="Jonathan Hammond" className="w-12 h-12 rounded-full mr-4 object-cover" />
          <div>
            <div className="font-medium text-[#1a1a1a]">Jonathan Hammond</div>
            <div className="text-sm text-gray-700">Author</div>
          </div>
        </div>

        {/* Featured image */}
        {postData.CoverImage?.url && (
          <img
            src={getOptimizedImageUrl(postData.CoverImage.url)}
            srcSet={getImageSrcSet(postData.CoverImage.url)}
            sizes="(max-width: 768px) 100vw, 1200px"
            alt={postData.Title || 'Blog post cover image'}
            loading="lazy"
            className="w-full h-auto rounded-lg shadow-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        )}

        {/* Post content */}
        <div className="prose prose-lg max-w-none pt-6">
          <ErrorBoundary>
            {processedContent && processedContent.length > 0 && (
              <div>
                {processedContent.map((block, index) => {
                  if (block.type === 'code-fence') {
                    return (
                      <pre key={index} className="bg-[#0a0a23] p-4 rounded-lg mb-4 overflow-x-auto">
                        <code className="block whitespace-pre text-sm font-mono text-[#ff00ff] font-bold">
                          {block.children[0].text}
                        </code>
                      </pre>
                    );
                  }
                  
                  return (
                    <BlocksRenderer
                      key={index}
                      content={[block]}
                      modifiers={{
                        bold: ({ children }) => <strong>{children}</strong>,
                        italic: ({ children }) => <em>{children}</em>,
                        underline: ({ children }) => <u>{children}</u>,
                        strikethrough: ({ children }) => <del>{children}</del>,
                        code: ({ children }) => (
                          <code className="bg-[#0a0a23] text-[#ff00ff] font-bold px-1 py-0.5 rounded">
                            {children}
                          </code>
                        ),
                      }}
                      blocks={{
                        paragraph: ({ children }) => <p className="mb-4 text-gray-900">{children}</p>,
                        heading: ({ children, level }) => {
                          const Tag = `h${level}`;
                          return <Tag className="text-gray-900 font-bold mb-4">{children}</Tag>;
                        },
                        list: ({ children, format }) => {
                          const listClass = format === 'ordered' ? 'list-decimal' : 'list-disc';
                          return <ul className={`${listClass} text-gray-900 ml-4 mb-4`}>{children}</ul>;
                        },
                        listItem: ({ children }) => <li className="mb-2">{children}</li>,
                        link: ({ children, url }) => (
                          <a 
                            href={url} 
                            className="text-[#004499] hover:text-[#0a0a23] hover:underline transition-all duration-200 ease-in-out"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    />
                  );
                })}
              </div>
            )}
          </ErrorBoundary>
        </div>

        {/* Back to posts link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link to="/posts" className="text-[#0066cc] no-underline font-medium hover:text-[#004499]">
            ← Back to Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
