import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { BLOG_POSTS } from '../data/blog';

const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(post => post.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Blog Post Not Found</h1>
          <Link to="/blog" className="text-primary-700 hover:text-primary-800">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="py-12">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm">
            <li className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-primary-700">Home</Link>
              <svg className="mx-2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="flex items-center">
              <Link to="/blog" className="text-gray-500 hover:text-primary-700">Blog</Link>
              <svg className="mx-2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-900">{post.title}</li>
          </ol>
        </nav>

        {/* Back to Blog */}
        <Link 
          to="/blog" 
          className="inline-flex items-center text-sm text-primary-700 hover:text-primary-800 mb-8"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Blog
        </Link>

        {/* Featured Image */}
        <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-8">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Article Header */}
        <header className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-600">
            <span className={`badge-${post.categoryColor}`}>
              {post.category}
            </span>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {post.date}
            </div>
            <div className="flex items-center">
              <User size={16} className="mr-1" />
              {post.author}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-medium mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600">
            {post.excerpt}
          </p>
        </header>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto prose prose-lg">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t">
          <div className="flex items-center flex-wrap gap-2">
            <Tag size={16} className="text-gray-600" />
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Share Buttons */}
        <div className="max-w-3xl mx-auto mt-8 flex justify-center gap-4">
          <button className="btn-outline px-4 py-2 text-sm">
            Share on Twitter
          </button>
          <button className="btn-outline px-4 py-2 text-sm">
            Share on Facebook
          </button>
          <button className="btn-outline px-4 py-2 text-sm">
            Share on LinkedIn
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;