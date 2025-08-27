import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';

interface HomePageProps {
  onNavigateToCatalog: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToCatalog }) => {
  const [showContactOptions, setShowContactOptions] = useState(false);

  const handlePhoneClick = () => {
    setShowContactOptions(true);
  };

  const handleCallOption = () => {
    window.open('tel:+254790049533', '_self');
    setShowContactOptions(false);
  };

  const handleWhatsAppOption = () => {
    const message = "Hello SeasideSeafood,%0A%0AI would like to inquire about your seafood products.%0A%0AThank you!";
    window.open(`https://wa.me/254790049533?text=${message}`, '_blank');
    setShowContactOptions(false);
  };

  const handleEmailClick = () => {
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=seafoodseaside7@gmail.com&su=Seafood%20Inquiry&body=Hello%20SeasideSeafood,%0A%0AI%20would%20like%20to%20inquire%20about%20your%20seafood%20products.%0A%0AThank%20you!', '_blank');
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
      {/* Catalog Button - Top Right */}
      <nav className="absolute top-6 right-6 z-50">
        <button
          onClick={onNavigateToCatalog}
          className="bg-white/15 backdrop-blur-lg border border-white/25 text-white px-8 py-3 rounded-2xl font-semibold shadow-xl hover:bg-white/25 transition-all duration-300 transform hover:scale-105"
        >
          Catalog
        </button>
      </nav>

      {/* Main Content - Centered */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-8">
        {/* Logo and Business Info */}
        <div className="text-center text-white mb-16 animate-in fade-in zoom-in duration-1000">
          <img
            src="/SEASIDESEAFOOD LOGO! copy.png"
            alt="Seaside Seafood Logo"
            className="w-32 h-32 sm:w-48 sm:h-48 mx-auto drop-shadow-2xl mb-6"
          />
          
          {/* Business Name with enhanced visibility */}
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-orange-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl" 
              style={{ 
               
                filter: 'drop-shadow(0 0 10px rgba(255,165,0,0.7)) drop-shadow(0 0 20px rgba(0,191,255,0.5))'
              }}>
            SEASIDE SEAFOOD
          </h1>
          
          <p className="text-lg sm:text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed font-medium"
             style={{ 
               textShadow: '1px 1px 3px rgba(0,0,0,0.9), 0 0 15px rgba(255,255,255,0.2)' 
             }}>
            Experience the finest selection of <span className="font-bold text-orange-300">fresh</span>, <span className="font-bold text-orange-300">affordable</span>, and <span className="font-bold text-orange-300">authentic seafood</span> from the coastal heart of Kenya; Diani
          </p>
        </div>

        {/* Contact Section - Positioned lower */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl max-w-lg mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6 text-center drop-shadow-lg">Get in Touch</h3>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Phone/WhatsApp Button */}
            <button
              onClick={handlePhoneClick}
              className="flex-1 bg-gradient-to-r from-blue-500/80 to-cyan-500/80 backdrop-blur-sm text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 border border-white/20"
            >
              <Phone className="h-5 w-5" />
              <span>Call / WhatsApp</span>
            </button>

            {/* Email Button */}
            <button
              onClick={handleEmailClick}
              className="flex-1 bg-gradient-to-r from-orange-500/80 to-red-500/80 backdrop-blur-sm text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 border border-white/20"
            >
              <Mail className="h-5 w-5" />
              <span>Email Us</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contact Options Modal */}
      {showContactOptions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Contact Method</h3>
            
            <div className="space-y-4">
              <button
                onClick={handleCallOption}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Phone className="h-6 w-6" />
                <span>Call Directly</span>
              </button>

              <button
                onClick={handleWhatsAppOption}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => setShowContactOptions(false)}
                className="w-full bg-gray-500 text-white px-6 py-3 rounded-2xl font-medium hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;