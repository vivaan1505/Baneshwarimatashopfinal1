import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
}

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4 dark:text-white">Our Collections</h1>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Explore our carefully curated collections featuring the finest selection of luxury products
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/9] bg-gray-200 rounded-xl mb-4 dark:bg-gray-700"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <h2 className="text-xl font-medium mb-2 dark:text-white">No collections found</h2>
            <p className="text-gray-500 dark:text-gray-400">Check back soon for new collections</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="group relative overflow-hidden rounded-xl shadow-sm"
              >
                <div className="aspect-[16/9]">
                  <img
                    src={collection.image_url || 'https://via.placeholder.com/800x450?text=Collection'}
                    alt={collection.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="text-2xl font-heading font-medium text-white mb-2">
                        {collection.name}
                      </h2>
                      <p className="text-gray-200 mb-4">
                        {collection.description}
                      </p>
                      <span className="inline-flex items-center text-white group-hover:text-accent-300 transition-colors">
                        Explore Collection
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;