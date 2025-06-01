import React from 'react';
import { Link } from 'react-router-dom';

const SpecialtyStores: React.FC = () => {
  const stores = [
    {
      id: 'bridal',
      name: 'Bridal Boutique',
      description: 'Everything you need for your perfect day',
      image: 'https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      link: '/bridal-boutique',
      badge: 'NEW',
      color: 'bg-secondary-50 text-secondary-900 border-secondary-200'
    },
    {
      id: 'festive',
      name: 'Festive Store',
      description: 'Discover perfect gifts and festive fashion for the holiday season',
      image: 'https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      link: '/festive-store',
      badge: 'NEW',
      color: 'bg-accent-50 text-accent-900 border-accent-200'
    }
  ];

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4">Specialty Collections</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our themed boutiques designed for special occasions and seasons
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map((store) => (
            <div 
              key={store.id}
              className={`rounded-xl overflow-hidden border ${store.color} transition-all hover:shadow-lg`}
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 h-64 md:h-auto">
                  <img 
                    src={store.image} 
                    alt={store.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${store.id === 'bridal' ? 'bg-secondary-100 text-secondary-800' : 'bg-accent-100 text-accent-800'}`}>
                      {store.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading font-medium mb-3">{store.name}</h3>
                  <p className="text-gray-600 mb-6">{store.description}</p>
                  <Link 
                    to={store.link}
                    className={`inline-flex items-center font-medium ${store.id === 'bridal' ? 'text-secondary-700 hover:text-secondary-800' : 'text-accent-700 hover:text-accent-800'} transition-colors`}
                  >
                    Explore Collection
                    <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialtyStores;