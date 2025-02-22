import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { strapiApi } from '../api/strapi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

export default function PostDetail() {
  const { id: slug } = useParams();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const response = await strapiApi.get(`/posts?filters[Slug][$eq]=${slug}&populate[CoverImage][fields][0]=url&populate[CoverImage][fields][1]=formats&populate=*`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading post: {error.message}
      </div>
    );
  }

  if (!posts?.data?.[0]) {
    return (
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
        <Link to="/posts" className="text-[#002ead] hover:text-[#00471b]">
          ← Back to Posts
        </Link>
      </div>
    );
  }

  const post = posts.data[0];

  return (
    <div className="bg-white">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post metadata */}
        <div className="mb-6">
          <span className="text-sm text-[#002ead] uppercase font-medium tracking-wide">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>

        {/* Post title */}
        <h1 className="text-4xl font-bold text-[#2a2a40] mb-6 leading-tight">
          {post.Title}
        </h1>

        {/* Author info */}
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
          <div>
            <div className="font-medium text-[#2a2a40]">Jonathan Hammond</div>
            <div className="text-sm text-gray-600">Author</div>
          </div>
        </div>

        {/* Featured image */}
        {post.CoverImage && (
          <div className="mb-8">
            <img
              src={post.CoverImage.formats.large.url.startsWith('http') ? post.CoverImage.formats.large.url : `${API_URL}${post.CoverImage.formats.large.url}`}
              alt={post.Title}
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* Post content */}
        <div className="prose prose-lg max-w-none">
          {post.Content?.map((block, index) => (
            <div key={index}>
              {block.children?.map((child, childIndex) => (
                <p key={childIndex} className="mb-4 text-gray-700">
                  {child.text}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Back to posts link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link to="/posts" className="text-[#002ead] hover:text-[#00471b] font-medium">
            ← Back to Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
