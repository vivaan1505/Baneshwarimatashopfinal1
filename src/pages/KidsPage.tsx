import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/common/ProductCard';
import CategoryFilter from '../components/shop/CategoryFilter';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

const KidsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const metaUpdatedRef = useRef(false);

  useEffect(() => {
    fetchKidsProducts();
    fetchSubcategories();

    // Update meta tags for SEO and social sharing
    updateMetaTags(
      'Kids Collection | MinddShopp',
      "Discover our premium selection of kids' clothing, footwear, and accessories. Shop quality products for children of all ages.",
      'https://images.pexels.com/photos/3771679/pexels-photo-3771679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      window.location.href
    );
    
    // Add structured data
    const webPageSchema = generateWebPageSchema({
      title: 'Kids Collection | MinddShopp',
      description: "Discover our premium selection of kids' clothing, footwear, and accessories. Shop quality products for children of all ages.",
      url: window.location.href
    });
    addStructuredData(webPageSchema);
    metaUpdatedRef.current = true;
    // eslint-disable-next-line
  }, []);

  // Update meta tags when category filter changes
  useEffect(() => {
    if (!metaUpdatedRef.current || selectedCategory === 'all') return;
    const categoryName = categories.find(c => c.id === selectedCategory)?.name || 'Kids';
    updateMetaTags(
      `Kids ${categoryName} | MinddShopp Collection`,
      `Shop our premium selection of kids' ${categoryName.toLowerCase()}. Quality products for children of all ages.`,
      'https://images.pexels.com/photos/3771679/pexels-photo-3771679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      `${window.location.origin}/kids?category=${selectedCategory}`
    );
    // eslint-disable-next-line
  }, [selectedCategory]);

  const fetchKidsProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          images:product_images(*)
        `)
        .eq('gender', 'kids')
        .eq('is_visible', true);
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching kids\' products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories from Supabase
  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name')
        .eq('parent_category', 'kids');
      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to load categories');
    }
  };

  // Create categories array for filter
  const categories = [
    { id: 'all', name: 'All Categories' },
    ...subcategories.map((cat) => ({ id: cat.id, name: cat.name })),
  ];

  const filterProducts = (products: any[]) => {
    let filtered = [...products];
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.subcategory === selectedCategory
      );
    }
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });
    return filtered;
  };

  const filteredProducts = filterProducts(products);

  // Friendly illustrations and pastel color backgrounds
  const ageGroups = [
    { name: 'Baby (0-2 years)', image: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/animal-2023924_1280.png' },
    { name: 'Toddler (2-4 years)', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/07/animal-156957_1280.png' },
    { name: 'Kids (4-8 years)', image: 'https://cdn.pixabay.com/photo/2017/01/31/13/05/animal-2023922_1280.png' },
    { name: 'Pre-Teen (8-12 years)', image: 'https://cdn.pixabay.com/photo/2016/03/31/20/11/animal-1297766_1280.png' }
  ];

  // Fun, playful background
  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-[#fff7e6] via-[#e1f6ff] to-[#e7ffe6] dark:from-gray-900 dark:via-gray-950 dark:to-black relative">
      {/* Decorative clouds and stars */}
      <div className="pointer-events-none select-none absolute left-0 top-0 w-full h-44 z-0">
        <img src="https://cdn.pixabay.com/photo/2013/07/12/13/23/cloud-146177_1280.png" alt="" className="absolute left-10 top-4 w-32 opacity-50" />
        <img src="https://cdn.pixabay.com/photo/2013/07/12/13/23/cloud-146177_1280.png" alt="" className="absolute right-10 top-12 w-28 opacity-40" />
        <img src="https://cdn.pixabay.com/photo/2012/04/11/17/22/star-29112_1280.png" alt="" className="absolute left-1/2 top-24 w-10 opacity-30" />
      </div>
      <div className="container-custom relative z-10">
        {/* Breadcrumbs with playful emoji */}
        <nav className="mb-6">
          <ol className="flex text-sm items-center gap-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-400 font-medium">
                Home
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li className="flex items-center text-gray-900 dark:text-white font-medium">
              👧🧒 Kids
            </li>
          </ol>
        </nav>

        {/* Category Header with playful font */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-heading font-extrabold mb-2 text-primary-700 dark:text-white tracking-tight" style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif" }}>
            Kids' Collection
          </h1>
          <p className="text-lg text-[#f59e42] max-w-2xl mx-auto mb-2 font-semibold" style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif" }}>
            Fun, Color, & Comfort for Every Little Explorer!
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Discover our premium selection of kids' clothing, footwear, and accessories, designed for comfort, durability, and style.
          </p>
        </div>

        {/* Age Groups with playful hover */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 dark:bg-gray-800">
          <h3 className="text-base font-bold text-[#43b0f1] mb-4" style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif" }}>
            🧸 Shop by Age
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ageGroups.map((group, index) => (
              <div key={index} className="relative overflow-hidden rounded-2xl aspect-square group border-2 border-dashed border-[#ffe066] bg-[#fffae6] hover:shadow-2xl transition-all duration-300">
                <img 
                  src={group.image} 
                  alt={group.name} 
                  className="w-full h-full object-contain p-4 scale-90 group-hover:scale-100 transition-transform duration-500"
                  style={{ filter: 'drop-shadow(0 4px 8px #f59e4266)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#ffda7ecc] to-transparent flex items-end pointer-events-none">
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-[#8c4a13] drop-shadow-sm" style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif" }}>{group.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Categories with playful icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/clothing?gender=kids" className="relative overflow-hidden rounded-2xl aspect-video group border-2 border-[#c3f584] bg-[#f6ffdf] hover:shadow-xl transition-all duration-300">
            <img 
              src="https://images.pexels.com/photos/3771583/pexels-photo-3771583.jpeg" 
              alt="Kids' Clothing" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#6fe7dd99] to-transparent flex items-end">
              <div className="p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif" }}>
                  👕 Clothing
                </h3>
                <p className="text-sm text-white/90">Tops, Bottoms & Outerwear</p>
              </div>
            </div>
          </Link>
          
          <Link to="/footwear?gender=kids" className="relative overflow-hidden rounded-2xl aspect-video group border-2 border-[#7fd8f6] bg-[#e0f7fa] hover:shadow-xl transition-all duration-300">
            <img 
              src="https://images.pexels.com/photos/36029/aroni-arsa-children-little.jpg" 
              alt="Kids' Footwear" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#43b0f199] to-transparent flex items-end">
              <div className="p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif" }}>
                  👟 Footwear
                </h3>
                <p className="text-sm text-white/90">Shoes, Sneakers & Boots</p>
              </div>
            </div>
          </Link>
          
          <Link to="/accessories?gender=kids" className="relative overflow-hidden rounded-2xl aspect-video group border-2 border-[#ffd6e0] bg-[#fff0f6] hover:shadow-xl transition-all duration-300">
            <img 
              src="https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg" 
              alt="Kids' Accessories" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#ff6f9199] to-transparent flex items-end">
              <div className="p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif" }}>
                  🧢 Accessories
                </h3>
                <p className="text-sm text-white/90">Bags, Hats & More</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-bounce rounded-full h-10 w-10 border-4 border-primary-400 bg-[#ffe066]" style={{boxShadow: '0 0 16px #f59e42cc'}}></div>
            <p className="mt-2 text-[#43b0f1] font-semibold" style={{fontFamily: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif"}}>Loading awesome finds...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <img src="https://cdn.pixabay.com/photo/2013/07/12/13/53/sad-147440_1280.png" alt="No products" className="mx-auto h-16 w-16 opacity-80 mb-2" />
            <p className="text-[#ff6f91] font-bold" style={{fontFamily: "'Comic Neue', 'Comic Sans MS', cursive, sans-serif"}}>Oops! No products found.</p>
            <p className="text-gray-500 dark:text-gray-400">Try a different category or search term!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KidsPage;