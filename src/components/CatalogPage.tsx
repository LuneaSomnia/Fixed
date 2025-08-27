import React, { useState, useMemo } from 'react';
import { Fish, Search } from 'lucide-react';
import ItemCard from './ItemCard';
import OrderModal from './OrderModal';

export interface SeafoodItem {
  id: string;
  name: string;
  price: number;
  quantity: string;
  category: string;
  image?: string;
}

const CatalogPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fish' | 'prawns' | 'other'>('fish');
  const [selectedItem, setSelectedItem] = useState<SeafoodItem | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fishItems: SeafoodItem[] = [
    { id: 'tuna', name: 'Tuna', price: 600, quantity: '1 KG', category: 'fish' },
    { id: 'red-snapper', name: 'Red Snapper', price: 600, quantity: '1 KG', category: 'fish' },
    { id: 'white-snapper', name: 'White Snapper', price: 600, quantity: '1 KG', category: 'fish' },
    { id: 'parrot-fish', name: 'Parrot Fish', price: 600, quantity: '1 KG', category: 'fish' },
    { id: 'black-runner', name: 'Black Runner', price: 600, quantity: '1 KG', category: 'fish' },
    { id: 'rockod-fish', name: 'Rockod Fish (Tewa)', price: 600, quantity: '1 KG', category: 'fish' },
    { id: 'seabus', name: 'Seabus', price: 600, quantity: '1 KG', category: 'fish' },
    { id: 'kingfish', name: 'KingFish', price: 600, quantity: '1 KG', category: 'fish' },
    { id: 'kolekole', name: 'Kolekole', price: 600, quantity: '1 KG', category: 'fish' },
    { id: 'pandu', name: 'Pandu', price: 600, quantity: '1 KG', category: 'fish' },
  ];

  const prawnItems: SeafoodItem[] = [
    { id: 'king-prawns', name: 'King Prawns', price: 2500, quantity: '1 KG', category: 'prawns' },
    { id: 'queen-prawns', name: 'Queen Prawns', price: 1400, quantity: '1 KG', category: 'prawns' },
    { id: 'tiger-prawns', name: 'Tiger Prawns', price: 2000, quantity: '1 KG', category: 'prawns' },
    { id: 'jumbo-prawns', name: 'Jumbo Prawns', price: 3200, quantity: '1 KG', category: 'prawns' },
    { id: 'mixed-prawns', name: 'Mixed Prawns', price: 1600, quantity: '1 KG', category: 'prawns' },
  ];

  const otherItems: SeafoodItem[] = [
    { 
      id: 'kalamari', 
      name: 'Kalamari (Squid)', 
      price: 800, 
      quantity: '1 KG', 
      category: 'other',
      image: 'https://images.pexels.com/photos/5677743/pexels-photo-5677743.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: 'octopus', 
      name: 'Octopus', 
      price: 600, 
      quantity: '1 KG', 
      category: 'other',
      image: 'https://images.pexels.com/photos/3296434/pexels-photo-3296434.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: 'lobster', 
      name: 'Lobster', 
      price: 2400, 
      quantity: '1 KG', 
      category: 'other',
      image: 'https://images.pexels.com/photos/566344/pexels-photo-566344.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: 'oyster', 
      name: 'Oyster', 
      price: 550, 
      quantity: '1 KG', 
      category: 'other',
      image: 'https://images.pexels.com/photos/5717463/pexels-photo-5717463.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: 'crabs', 
      name: 'Crabs', 
      price: 750, 
      quantity: '1 KG', 
      category: 'other',
      image: 'https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
  ];

  const allItems = [...fishItems, ...prawnItems, ...otherItems];

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'fish':
        return fishItems;
      case 'prawns':
        return prawnItems;
      case 'other':
        return otherItems;
      default:
        return fishItems;
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) {
      return getCurrentItems();
    }
    
    return allItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, activeTab]);

  const handlePlaceOrder = (item: SeafoodItem) => {
    setSelectedItem(item);
    setShowOrderModal(true);
  };

  const getTabImage = (tab: string) => {
    switch (tab) {
      case 'fish':
        return 'https://images.pexels.com/photos/128408/pexels-photo-128408.jpeg?auto=compress&cs=tinysrgb&w=300';
      case 'prawns':
        return 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=300';
      default:
        return '';
    }
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/Homepage Background Image.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Glassmorphism Overlay - 70% opacity for partial visibility */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-3 drop-shadow-lg"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Our Fresh Seafood Catalog
          </h2>
          <p className="text-base text-white drop-shadow"
             style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
            Browse our selection of premium seafood, all priced per kilogram
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search seafood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Tabs - Only show if no search query */}
        {!searchQuery && (
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            {/* Fish Tab */}
            <div 
              className={`relative flex-1 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'fish' ? 'ring-2 ring-orange-400 shadow-lg' : 'shadow-md hover:shadow-lg'
              }`}
              onClick={() => setActiveTab('fish')}
            >
              <img
                src={getTabImage('fish')}
                alt="Fresh Fish"
                className="w-full h-20 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="absolute bottom-2 left-3 right-3">
                <h3 className="text-white text-base font-bold">Fresh Fish</h3>
                <p className="text-white/90 text-xs">Premium catch from Diani waters</p>
              </div>
            </div>

            {/* Prawns Tab */}
            <div 
              className={`relative flex-1 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'prawns' ? 'ring-2 ring-orange-400 shadow-lg' : 'shadow-md hover:shadow-lg'
              }`}
              onClick={() => setActiveTab('prawns')}
            >
              <img
                src={getTabImage('prawns')}
                alt="Fresh Prawns"
                className="w-full h-20 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="absolute bottom-2 left-3 right-3">
                <h3 className="text-white text-base font-bold">Premium Prawns</h3>
                <p className="text-white/90 text-xs">Various sizes and types available</p>
              </div>
            </div>

            {/* Other Seafood Tab */}
            <div 
              className={`relative flex-1 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-cyan-500 to-blue-600 ${
                activeTab === 'other' ? 'ring-2 ring-orange-400 shadow-lg' : 'shadow-md hover:shadow-lg'
              }`}
              onClick={() => setActiveTab('other')}
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="relative h-20 flex items-center justify-center">
                <div className="text-center">
                  <Fish className="h-6 w-6 text-white mx-auto mb-1" />
                  <h3 className="text-white text-base font-bold">Other Seafood</h3>
                  <p className="text-white/90 text-xs">Specialty items & delicacies</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white drop-shadow"
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
              Search results for "{searchQuery}" ({filteredItems.length} items)
            </h3>
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onPlaceOrder={handlePlaceOrder}
            />
          ))}
        </div>

        {/* No Results */}
        {searchQuery && filteredItems.length === 0 && (
          <div className="text-center py-8">
            <Fish className="h-12 w-12 text-white/50 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2"
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
              No seafood found
            </h3>
            <p className="text-white/70 text-sm"
               style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              Try searching with different keywords
            </p>
          </div>
        )}

        {/* Order Modal */}
        {showOrderModal && selectedItem && (
          <OrderModal
            item={selectedItem}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedItem(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CatalogPage;