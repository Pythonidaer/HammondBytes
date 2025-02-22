import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { strapiApi } from '../api/strapi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

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
  if (!posts?.data) return <div>No posts found</div>;

  return (
    <div className="w-full overflow-x-hidden">
      {/* Profile Section */}
      <div className="py-12 sm:py-24 mb-8 sm:mb-16 px-4">
        <div className="text-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full mx-auto mb-6 sm:mb-8"></div>
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
              className="bg-black rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Link to={`/posts/${post.Slug}`} className="block">
                <div className="aspect-[3/2] overflow-hidden">
                  {post.CoverImage?.url ? (
                    <img
                      src={`${API_URL}${post.CoverImage.url}`}
                      alt={post.Title || 'Blog post image'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  <Link 
                    to={`/posts/${post.Slug}`}
                    className="text-white hover:text-[#0066cc] transition-colors"
                  >
                    {post.Title || 'Untitled Post'}
                  </Link>
                </h2>
                <p className="text-gray-400 mb-4 line-clamp-2 text-sm sm:text-base">
                  {post.Content?.[0]?.children?.[0]?.text || 'No content available'}
                </p>
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
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
                  <span>5 min read</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
