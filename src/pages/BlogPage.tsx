import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface BlogPost {
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

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
    fetchCategories();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          categories:blog_post_categories(
            category:blog_categories(name, slug)
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      
      // Get unique author IDs
      const authorIds = [...new Set((data || []).map(post => post.author_id))];
      
      // Fetch author details if there are any posts
      if (authorIds.length > 0) {
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
              body: JSON.stringify({ userIds: authorIds }),
            });
            
            if (response.ok) {
              const users = await response.json();
              
              // Create a map of user data
              const userMap = new Map(users.map((user: any) => [user.id, user]));
              
              // Add author data to posts
              const postsWithAuthors = data?.map(post => ({
                ...post,
                author: userMap.get(post.author_id)
              }));
              
              setBlogPosts(postsWithAuthors || []);
            } else {
              // If we can't get author details, still set the posts
              setBlogPosts(data || []);
            }
          } else {
            // If no session, just set the posts without author details
            setBlogPosts(data || []);
          }
        } catch (error) {
          console.error('Error fetching author details:', error);
          setBlogPosts(data || []);
        }
      } else {
        setBlogPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      post.categories.some(c => c.category.slug === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Get author name from post
  const getAuthorName = (post: BlogPost) => {
    if (post.author?.user_metadata?.first_name && post.author?.user_metadata?.last_name) {
      return `${post.author.user_metadata.first_name} ${post.author.user_metadata.last_name}`;
    }
    return post.author?.email?.split('@')[0] || 'Anonymous';
  };

  // Get formatted date
  const getFormattedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Get category color class
  const getCategoryColorClass = (categoryName: string) => {
    const colorMap: Record<string, string> = {
      'Fashion Trends': 'primary',
      'Style Guide': 'secondary',
      'Beauty Tips': 'accent',
      'Lifestyle': 'success',
      'Interviews': 'warning'
    };
    
    return colorMap[categoryName] || 'primary';
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 dark:text-white">
            MinddShopp Blog
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Discover the latest in fashion trends, styling tips, and expert advice on luxury fashion and beauty.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                aria-label="Search articles"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-primary-600 text-white dark:bg-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-primary-600 text-white dark:bg-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading blog posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <h2 className="text-xl font-medium mb-2 dark:text-white">No posts found</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="card group dark:bg-gray-800">
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="relative overflow-hidden h-56">
                    <img 
                      src={post.featured_image || 'https://via.placeholder.com/600x400?text=No+Image'} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    {post.categories.length > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className={`badge-${getCategoryColorClass(post.categories[0].category.name)}`}>
                          {post.categories[0].category.name}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3 dark:text-gray-400">
                    <div className="flex items-center">
                      <User size={14} className="mr-1" />
                      <span>{getAuthorName(post)}</span>
                    </div>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{getFormattedDate(post.published_at || post.created_at)}</span>
                    </div>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`} className="block group">
                    <h2 className="text-xl font-heading font-medium mb-2 group-hover:text-primary-700 transition-colors dark:text-white dark:group-hover:text-primary-400">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 dark:text-gray-300">
                    {post.excerpt}
                  </p>
                  
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary-700 hover:text-primary-800 font-medium text-sm transition-colors dark:text-primary-400 dark:hover:text-primary-300"
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
        )}
      </div>
    </div>
  );
};

export default BlogPage;