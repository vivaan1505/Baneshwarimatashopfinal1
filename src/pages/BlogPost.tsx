import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Share } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author_id: string;
  status: string;
  published_at: string;
  created_at: string;
  author?: {
    email: string;
    user_metadata: {
      first_name: string;
      last_name: string;
    };
  };
  categories: {
    category: {
      name: string;
      slug: string;
    };
  }[];
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug);
    }
  }, [slug]);

  const fetchBlogPost = async (postSlug: string) => {
    try {
      setLoading(true);
      
      // Fetch the blog post
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          categories:blog_post_categories(
            category:blog_categories(name, slug)
          )
        `)
        .eq('slug', postSlug)
        .eq('status', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Post not found
          setLoading(false);
          return;
        }
        throw error;
      }
      
      if (!data) {
        setLoading(false);
        return;
      }
      
      // Try to fetch author details
      try {
        // Get the current session for the auth token
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          // Fetch user data from the Edge Function
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-users`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userIds: [data.author_id] }),
          });
          
          if (response.ok) {
            const users = await response.json();
            if (users.length > 0) {
              data.author = users[0];
            }
          }
        }
      } catch (error) {
        console.error('Error fetching author details:', error);
        // Continue without author details
      }
      
      setPost(data);
      
      // Fetch related posts (same category)
      if (data.categories && data.categories.length > 0) {
        const categoryId = data.categories[0].category.slug;
        
        const { data: relatedData, error: relatedError } = await supabase
          .from('blog_posts')
          .select(`
            *,
            categories:blog_post_categories(
              category:blog_categories(name, slug)
            )
          `)
          .eq('status', 'published')
          .neq('id', data.id)
          .limit(3);
          
        if (!relatedError && relatedData) {
          // Filter to posts that share a category
          const filteredRelated = relatedData.filter(relatedPost => 
            relatedPost.categories.some(c => 
              data.categories.some(postCat => 
                c.category.slug === postCat.category.slug
              )
            )
          );
          
          setRelatedPosts(filteredRelated.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  // Get author name from post
  const getAuthorName = (post: BlogPostData) => {
    if (post.author?.user_metadata?.first_name && post.author?.user_metadata?.last_name) {
      return `${post.author.user_metadata.first_name} ${post.author.user_metadata.last_name}`;
    }
    return post.author?.email?.split('@')[0] || 'Anonymous';
  };

  // Get formatted date
  const getFormattedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Share post
  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      })
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 dark:bg-gray-700"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-8 dark:bg-gray-700"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4 dark:text-white">Blog Post Not Found</h1>
          <Link to="/blog" className="text-primary-700 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
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
              <Link to="/" className="text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400">Home</Link>
              <svg className="mx-2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="flex items-center">
              <Link to="/blog" className="text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400">Blog</Link>
              <svg className="mx-2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-900 dark:text-white truncate max-w-xs">{post.title}</li>
          </ol>
        </nav>

        {/* Back to Blog */}
        <Link 
          to="/blog" 
          className="inline-flex items-center text-sm text-primary-700 hover:text-primary-800 mb-8 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Blog
        </Link>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-8">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            {post.categories.length > 0 && (
              <span className="badge-primary">
                {post.categories[0].category.name}
              </span>
            )}
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {getFormattedDate(post.published_at || post.created_at)}
            </div>
            <div className="flex items-center">
              <User size={16} className="mr-1" />
              {getAuthorName(post)}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-medium mb-4 dark:text-white">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {post.excerpt}
          </p>
        </header>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-heading prose-headings:font-medium prose-a:text-primary-600 dark:prose-a:text-primary-400">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        {post.categories.length > 0 && (
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t dark:border-gray-700">
            <div className="flex items-center flex-wrap gap-2">
              <Tag size={16} className="text-gray-600 dark:text-gray-400" />
              {post.categories.map(cat => (
                <Link 
                  key={cat.category.slug}
                  to={`/blog?category=${cat.category.slug}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  {cat.category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="max-w-3xl mx-auto mt-8 flex justify-center gap-4">
          <button 
            onClick={sharePost}
            className="btn-outline px-4 py-2 text-sm flex items-center"
          >
            <Share className="mr-2 h-4 w-4" />
            Share This Post
          </button>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-medium mb-8 text-center dark:text-white">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(relatedPost => (
                <article key={relatedPost.id} className="card group dark:bg-gray-800">
                  <Link to={`/blog/${relatedPost.slug}`} className="block">
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={relatedPost.featured_image || 'https://via.placeholder.com/600x400?text=No+Image'} 
                        alt={relatedPost.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <Link to={`/blog/${relatedPost.slug}`} className="block group">
                      <h3 className="text-lg font-heading font-medium mb-2 group-hover:text-primary-700 transition-colors dark:text-white dark:group-hover:text-primary-400">
                        {relatedPost.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm dark:text-gray-300">
                      {relatedPost.excerpt}
                    </p>
                    
                    <Link 
                      to={`/blog/${relatedPost.slug}`}
                      className="text-primary-700 hover:text-primary-800 text-sm font-medium dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogPost;