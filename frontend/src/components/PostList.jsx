import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { strapiApi } from '../api/strapi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

// Standard dimensions for post thumbnails
const THUMBNAIL_WIDTH = 800;
const THUMBNAIL_HEIGHT = 533; // 3:2 aspect ratio

const getOptimizedImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/')) {
    return `${API_URL}${url}`;
  }
  // Only use Cloudinary optimization in production
  if (import.meta.env.PROD && url.includes('cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0];
    const imagePath = url.split('/upload/')[1];
    return `${baseUrl}/upload/c_fill,w_${THUMBNAIL_WIDTH},h_${THUMBNAIL_HEIGHT},q_auto,f_auto/${imagePath}`;
  }
  return url;
};

const getTextFromBlocks = (blocks) => {
  if (!blocks) return '';
  if (typeof blocks === 'string') return blocks;
  
  return blocks
    .map(block => {
      if (block.children) {
        return block.children
          .map(child => child.text || '')
          .join(' ');
      }
      return '';
    })
    .join(' ');
};

const calculateReadingTime = (content) => {
  if (!content) return 2; // Return base time if no content
  
  const text = getTextFromBlocks(content);
  const wordsPerMinute = 250;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes + 2; // Add 2 minutes for technical content comprehension
};

export default function PostList() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await strapiApi.get('/posts?populate=*');
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full overflow-x-hidden">
      {/* Profile Section */}
      <div className="py-8 sm:py-12 mb-8 sm:mb-12 px-4">
        <div className="text-center">
          <img src="/profile_pic.png" alt="Jonathan Hammond" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-6 sm:mb-8 object-cover" />
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#2a2a40] mb-3 sm:mb-4">Jonathan Hammond</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            Frontend Engineer currently{' '}
            <span className="text-blue-600">#OpenToWork</span>
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-24">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.data.map((post) => (
            <article 
              key={post.id} 
              className="bg-gray-900 rounded-lg overflow-hidden flex flex-col h-full"
            >
              <Link 
                to={`/posts/${post.Slug}`}
                className="block"
              >
                {post.CoverImage?.url ? (
                  <img
                    src={getOptimizedImageUrl(post.CoverImage.url)}
                    alt={post.Title}
                    width={THUMBNAIL_WIDTH}
                    height={THUMBNAIL_HEIGHT}
                    className="w-full aspect-[3/2] object-cover bg-gray-100 rounded-t-lg"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full aspect-[3/2] bg-gray-800 rounded-t-lg" />
                )}
              </Link>
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  <Link 
                    to={`/posts/${post.Slug}`}
                    className="text-white hover:text-[#99c9ff] transition-colors"
                  >
                    {post.Title || 'Untitled Post'}
                  </Link>
                </h2>
                <p className="text-gray-300 mb-4 line-clamp-2 text-sm sm:text-base">
                  {getTextFromBlocks(post.Content) || 'No content available'}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs sm:text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <time>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                    <span>·</span>
                    <span>Jonathan Hammond</span>
                  </div>
                  <span>{calculateReadingTime(post.Content || '')} min read</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
