import React, { useState } from 'react';
import { Fish } from 'lucide-react';
import HomePage from './components/HomePage';
import CatalogPage from './components/CatalogPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog'>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePageTransition = (page: 'home' | 'catalog') => {
    if (page === currentPage) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation for Catalog Page */}
      {currentPage === 'catalog' && (
        <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14">
              <div className="flex items-center space-x-2">
                <img
                  src="/SEASIDESEAFOOD LOGO! copy.png"
                  alt="Seaside Seafood Logo"
                  className="h-8 w-8"
                />
                <h1 className="text-lg font-bold text-white drop-shadow"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                  Seaside Seafood
                </h1>
              </div>
              <button
                onClick={() => handlePageTransition('home')}
                className="bg-white/15 backdrop-blur-lg border border-white/25 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/25 transition-all duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Page Content with smooth transition */}
      <div className={`transition-all duration-500 ease-in-out ${
        isTransitioning 
          ? 'opacity-0 transform translate-x-full' 
          : 'opacity-100 transform translate-x-0'
      }`}>
        {currentPage === 'home' ? (
          <HomePage onNavigateToCatalog={() => handlePageTransition('catalog')} />
        ) : (
          <CatalogPage />
        )}
      </div>
    </div>
  );
}

export default App;