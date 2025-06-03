import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Share, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { updateMetaTags, addStructuredData, generateArticleSchema, generateBreadcrumbSchema } from '../utils/seo';
import { AdBanner } from '../components/common/AdBanner';

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
  const [isExpanded, setIsExpanded] = useState(false);
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
      
      // Update SEO metadata
      if (data) {
        updateMetaTags(
          `${data.title} | MinddShopp Blog`,
          data.excerpt || 'Read our latest blog post at MinddShopp',
          data.featured_image,
          window.location.href
        );
        
        // Add article schema
        const articleSchema = generateArticleSchema({
          title: data.title,
          description: data.excerpt || '',
          imageUrl: data.featured_image || '',
          datePublished: data.published_at || data.created_at,
          dateModified: data.updated_at,
          authorName: data.author ? 
            `${data.author.user_metadata?.first_name || ''} ${data.author.user_metadata?.last_name || ''}`.trim() || 
            data.author.email?.split('@')[0] || 'MinddShopp' : 'MinddShopp'
        });
        
        // Add breadcrumb schema
        const breadcrumbs = [
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: data.title, url: `/blog/${data.slug}` }
        ];
        
        const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
        
        // Add both schemas
        addStructuredData([articleSchema, breadcrumbSchema]);
      }
      
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

  // Toggle expanded view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
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

  // If expanded view is active, render a modal-like view
  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            {post.featured_image && (
              <div className="h-64 md:h-80">
                <img 
                  src={post.featured_image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <button 
              onClick={toggleExpanded}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex items-center text-sm text-gray-500 mb-4 dark:text-gray-400">
              <div className="flex items-center">
                <User size={14} className="mr-1" />
                <span>{getAuthorName(post)}</span>
              </div>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{getFormattedDate(post.published_at || post.created_at)}</span>
              </div>
              {post.categories.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span className={`badge-primary`}>
                    {post.categories[0].category.name}
                  </span>
                </>
              )}
            </div>
            
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 dark:text-white">
              {post.title}
            </h2>
            
            <p className="text-gray-600 text-lg mb-6 dark:text-gray-300">
              {post.excerpt}
            </p>
            
            <div 
              className="prose max-w-none dark:prose-invert prose-img:rounded-lg prose-headings:font-heading"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-8 pt-6 border-t dark:border-gray-700 flex justify-between">
              <button
                onClick={toggleExpanded}
                className="btn-outline"
              >
                Close
              </button>
              
              <button 
                onClick={sharePost}
                className="btn-primary flex items-center"
              >
                <Share className="mr-2 h-4 w-4" />
                Share
              </button>
            </div>
          </div>
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
          <div dangerouslySetInnerHTML={{ __html: post.content.substring(0, 1000) + '...' }} />
          
          <div className="mt-8 text-center">
            <button
              onClick={toggleExpanded}
              className="btn-primary"
            >
              Read Full Article
            </button>
          </div>
        </div>

        {/* Ad Banner */}
        <AdBanner slot="5678901234" className="my-12 py-4 bg-gray-100 dark:bg-gray-800 text-center" />

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
          
          <button
            onClick={toggleExpanded}
            className="btn-primary px-4 py-2 text-sm"
          >
            Read Full Article
          </button>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-medium mb-8 text-center dark:text-white">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(relatedPost => (
                <article key={relatedPost.id} className="card group dark:bg-gray-800">
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={relatedPost.featured_image || 'https://via.placeholder.com/600x400?text=No+Image'} 
                      alt={relatedPost.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-heading font-medium mb-2 group-hover:text-primary-700 transition-colors dark:text-white dark:group-hover:text-primary-400">
                      {relatedPost.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm dark:text-gray-300">
                      {relatedPost.excerpt}
                    </p>
                    
                    <button 
                      onClick={() => {
                        navigate(`/blog/${relatedPost.slug}`);
                      }}
                      className="text-primary-700 hover:text-primary-800 text-sm font-medium dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Read More →
                    </button>
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