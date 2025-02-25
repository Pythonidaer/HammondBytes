import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { strapiApi } from '../api/strapi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

// Standard dimensions for detail view
const DETAIL_WIDTH = 1200;
const DETAIL_HEIGHT = 800; // 3:2 aspect ratio

const getOptimizedImageUrl = (url, width = DETAIL_WIDTH) => {
  if (!url) return '';
  if (url.startsWith('/')) {
    return `${API_URL}${url}`;
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
          {postData.Content?.map((block, index) => (
            <div key={index}>
              {block.children?.map((child, childIndex) => (
                <p key={childIndex} className="mb-4 text-gray-900">
                  {child.text}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Back to posts link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link to="/posts" className="link-blue font-medium">
            ← Back to Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
