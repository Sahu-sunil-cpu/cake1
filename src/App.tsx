import React, { useState } from 'react';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { Cake, Order } from './types';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroSection } from './components/HeroSection';
import { CategoryRibbon } from './components/CategoryRibbon';
import { OccasionCards } from './components/OccasionCards';
import { CakeCatalog } from './components/CakeCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CustomizationModal } from './components/CustomizationModal';
import { CustomCakeBuilder } from './components/CustomCakeBuilder';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { BakerAdminPortal } from './components/BakerAdminPortal';
import { AboutBakerSection } from './components/AboutBakerSection';
import { Footer } from './components/Footer';
import { LocationCheckerModal } from './components/LocationCheckerModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Sparkles, ArrowRight } from 'lucide-react';

function BakeryAppContent() {
  const {
    activeTab,
    setActiveTab,
    isAdminMode,
    isCartOpen,
    setIsCartOpen,
    isLocationModalOpen,
    setIsLocationModalOpen,
    cakes,
  } = useBakery();

  // Active modals state
  const [selectedCakeForDetail, setSelectedCakeForDetail] = useState<Cake | null>(null);
  const [selectedCakeForCustomize, setSelectedCakeForCustomize] = useState<Cake | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Home catalog filter state
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  const [catalogOccasion, setCatalogOccasion] = useState<string>('all');

  const handleSelectCategory = (catName: string) => {
    setCatalogCategory(catName);
    setActiveTab('cakes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOccasion = (occName: string) => {
    setCatalogOccasion(occName);
    setActiveTab('cakes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCustomize = (cake: Cake) => {
    setSelectedCakeForCustomize(cake);
  };

  const handleOpenDetail = (cake: Cake) => {
    setSelectedCakeForDetail(cake);
  };

  const handleOrderSuccess = (order: Order) => {
    // Switch to customer dashboard after confirmation if desired
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans text-[#231815] selection:bg-[#F4DDD2] selection:text-[#B83A4B]">
      
      {/* Top Navigation */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenSearch={() => setActiveTab('cakes')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {isAdminMode ? (
          /* Baker Admin View */
          <BakerAdminPortal />
        ) : (
          /* Customer Views */
          <>
            {/* TAB: HOME */}
            {activeTab === 'home' && (
              <div>
                {/* Hero with Delivery Check & Call to Action */}
                <HeroSection
                  onOpenLocationModal={() => setIsLocationModalOpen(true)}
                />

                {/* Ribbon of Categories */}
                <CategoryRibbon
                  selectedCategory={catalogCategory}
                  onSelectCategory={handleSelectCategory}
                />

                {/* Occasion Cards */}
                <OccasionCards onSelectOccasion={handleSelectOccasion} />

                {/* Curated Bestsellers Catalog */}
                <div className="py-4">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-bold text-[#B83A4B]">
                        Studio Signatures
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#231815]">
                        Most Loved Handcrafted Cakes
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('cakes')}
                      className="text-xs sm:text-sm font-semibold text-[#B83A4B] hover:text-[#A23040] flex items-center gap-1 hover:underline"
                    >
                      <span>View Complete Menu</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <CakeCatalog
                    initialCategory={catalogCategory}
                    initialOccasion={catalogOccasion}
                    onCustomize={handleOpenCustomize}
                    onViewDetails={handleOpenDetail}
                  />
                </div>

                {/* Dream Cake Callout Banner */}
                <div className="py-12 bg-gradient-to-br from-[#3E2419] to-[#24130C] text-white">
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E5DACB]">
                        <Sparkles className="w-3.5 h-3.5 text-[#E6A868]" />
                        <span>Bespoke Theme & Wedding Cakes</span>
                      </div>
                      <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                        Have an exact Pinterest concept in mind?
                      </h3>
                      <p className="text-xs sm:text-sm text-[#DDD2C4] max-w-xl">
                        Chef Aarti sculpts custom multi-tiered fondant, Lambeth vintage piping, and hand-painted watercolor cakes. Upload your photos for a free custom quotation.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('custom');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-8 py-3.5 rounded-2xl bg-[#B83A4B] hover:bg-[#A23040] text-white font-semibold text-xs sm:text-sm shadow-xl active:scale-95 transition-all whitespace-nowrap flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Design Dream Cake</span>
                    </button>
                  </div>
                </div>

                {/* Story & Reviews Section */}
                <AboutBakerSection />
              </div>
            )}

            {/* TAB: CAKES CATALOG */}
            {activeTab === 'cakes' && (
              <div>
                <CakeCatalog
                  initialCategory={catalogCategory}
                  initialOccasion={catalogOccasion}
                  onCustomize={handleOpenCustomize}
                  onViewDetails={handleOpenDetail}
                />
              </div>
            )}

            {/* TAB: CUSTOM CAKE BUILDER */}
            {activeTab === 'custom' && <CustomCakeBuilder />}

            {/* TAB: ABOUT CHEF AARTI */}
            {activeTab === 'about' && <AboutBakerSection />}

            {/* TAB: CUSTOMER DASHBOARD */}
            {activeTab === 'dashboard' && (
              <CustomerDashboard onCustomizeCake={handleOpenCustomize} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onOpenCart={() => setIsCartOpen(true)} />

      {/* Floating WhatsApp Support Button */}
      <FloatingWhatsApp />

      {/* MODALS */}
      {/* Location / Pincode Checker Modal */}
      <LocationCheckerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        cake={selectedCakeForDetail}
        onClose={() => setSelectedCakeForDetail(null)}
        onCustomize={(cake) => {
          setSelectedCakeForDetail(null);
          setSelectedCakeForCustomize(cake);
        }}
      />

      {/* Cake Customization Live Drawer/Modal */}
      <CustomizationModal
        cake={selectedCakeForCustomize}
        onClose={() => setSelectedCakeForCustomize(null)}
        onAddToCartComplete={() => {
          setIsCartOpen(true);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

    </div>
  );
}

export default function App() {
  return (
    <BakeryProvider>
      <BakeryAppContent />
    </BakeryProvider>
  );
}
