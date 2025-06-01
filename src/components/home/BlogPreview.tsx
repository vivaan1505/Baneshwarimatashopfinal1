import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { BLOG_POSTS } from '../../data/blog';

const BlogPreview: React.FC = () => {
  const featuredPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4">From Our Blog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Latest fashion trends, styling tips, and product insights
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <article key={post.id} className="card hover:translate-y-[-5px] transition-transform duration-300">
              <Link to={`/blog/${post.slug}`} className="block">
                <div className="relative overflow-hidden h-56">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`badge-${post.categoryColor}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
              </Link>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{post.date}</span>
                  </div>
                </div>
                
                <Link to={`/blog/${post.slug}`} className="block group">
                  <h3 className="text-xl font-medium font-heading mb-2 group-hover:text-primary-700 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <Link 
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-primary-700 hover:text-primary-800 font-medium text-sm transition-colors"
                >
                  Read More
                  <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/blog" className="btn-outline">
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;