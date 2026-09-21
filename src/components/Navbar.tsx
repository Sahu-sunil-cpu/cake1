import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  MapPin,
  Menu,
  X,
  Cake as CakeIcon,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  PhoneCall,
} from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

interface NavbarProps {
  onOpenLocationModal: () => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLocationModal,
  onOpenSearch,
  onOpenCart,
}) => {
  const {
    activeTab,
    setActiveTab,
    cart,
    wishlist,
    checkedPincode,
    deliveryEligibility,
    currentUser,
    isAdminMode,
    setIsAdminMode,
    settings,
  } = useBakery();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'cakes', label: 'Cakes' },
    { id: 'custom', label: 'Custom Cake' },
    { id: 'occasions', label: 'Occasions' },
    { id: 'bestsellers', label: 'Best Sellers' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About Studio' },
    { id: 'faq', label: 'FAQ & Pickup' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-[#2B1810] text-[#EFE8DA] text-[11px] md:text-xs py-1.5 px-4 font-medium flex items-center justify-between border-b border-[#3E2419]">
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>
            Baking fresh for celebrations • <strong>Self Pickup</strong> from Indiranagar or <strong>Doorstep Delivery</strong>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[#C9BAAF]">
          <span className="flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-[#E89080]" />
            Direct Studio: {settings.phone}
          </span>
          <button
            id="toggle-admin-header-btn"
            onClick={() => setIsAdminMode(!isAdminMode)}
            className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-white font-semibold flex items-center gap-1 transition-colors border border-white/10"
          >
            <ShieldCheck className="w-3 h-3 text-amber-300" />
            {isAdminMode ? 'Exit Admin View' : 'Baker Admin View'}
          </button>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD3] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-2 md:gap-4">
            
            {/* Left: Mobile menu button + Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                id="mobile-hamburger-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#3E2419] hover:bg-[#EFE8DA] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div
                id="brand-logo"
                onClick={() => handleNavClick('home')}
                className="cursor-pointer flex items-center gap-2 group"
              >
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#FAF0EC] border border-[#E89080]/30 flex items-center justify-center text-[#B83A4B] shadow-xs group-hover:scale-105 transition-transform">
                  <CakeIcon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-xl md:text-2xl text-[#2B1810] tracking-tight leading-none group-hover:text-[#B83A4B] transition-colors">
                    {settings.bakeryName}
                  </span>
                  <span className="text-[10px] md:text-[11px] font-sans tracking-wider uppercase text-[#8C7A74] font-medium mt-0.5">
                    Artisan Home Bakery
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'text-[#B83A4B] font-semibold'
                        : 'text-[#5C4D47] hover:text-[#2B1810] hover:bg-[#F2EAE0]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#B83A4B] rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Location Pill + Search + Wishlist + Cart + Profile */}
            <div className="flex items-center gap-1.5 md:gap-3">
              
              {/* Location / Pincode pill */}
              <button
                id="location-checker-trigger"
                onClick={onOpenLocationModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2EAE0] hover:bg-[#EBE2D4] text-xs text-[#3E2419] font-medium border border-[#E0D5C7] transition-all"
                title="Check delivery eligibility"
              >
                <MapPin className="w-3.5 h-3.5 text-[#B83A4B]" />
                <span className="truncate max-w-[110px] md:max-w-[140px]">
                  {checkedPincode ? `PIN: ${checkedPincode}` : 'Delivery Pin'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    deliveryEligibility === 'serviceable'
                      ? 'bg-emerald-500'
                      : deliveryEligibility === 'pickup_only'
                      ? 'bg-amber-500'
                      : 'bg-gray-400'
                  }`}
                ></span>
              </button>

              {/* Search button */}
              <button
                id="navbar-search-btn"
                onClick={onOpenSearch}
                className="p-2 md:p-2.5 rounded-full hover:bg-[#EFE8DA] text-[#4A3D38] transition-colors relative"
                aria-label="Search cakes"
                title="Search cakes"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist button */}
              <button
                id="navbar-wishlist-btn"
                onClick={() => handleNavClick('dashboard')}
                className="hidden sm:flex p-2 md:p-2.5 rounded-full hover:bg-[#EFE8DA] text-[#4A3D38] transition-colors relative"
                aria-label="Wishlist"
                title="Saved cakes"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#B83A4B] text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart button */}
              <button
                id="navbar-cart-btn"
                onClick={onOpenCart}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#3E2419] hover:bg-[#2B1810] text-white font-medium text-xs md:text-sm shadow-sm transition-all active:scale-95"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#F7DDD4]" />
                <span className="font-semibold">{cartItemCount}</span>
                <span className="hidden md:inline text-xs text-[#EFE8DA]/80 border-l border-white/20 pl-2">
                  ₹{cart.reduce((s, i) => s + i.totalPrice, 0).toLocaleString()}
                </span>
              </button>

              {/* Profile button */}
              <div className="relative">
                <button
                  id="navbar-profile-trigger"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="p-2 md:p-2.5 rounded-full hover:bg-[#EFE8DA] text-[#4A3D38] transition-colors flex items-center gap-1"
                  aria-label="Customer Account"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-3.5 h-3.5 text-[#8C7A74] hidden md:block" />
                </button>

                {profileDropdownOpen && (
                  <div
                    id="profile-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8DFD3] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-[#2D2421] truncate">
                        {currentUser?.name || 'Celebration Guest'}
                      </p>
                    </div>

                    <button
                      id="dropdown-orders-link"
                      onClick={() => {
                        handleNavClick('dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#FAF7F2] hover:text-[#B83A4B] flex items-center gap-2"
                    >
                      <CakeIcon className="w-4 h-4 text-[#B83A4B]" />
                      My Orders & Tracking
                    </button>

                    <button
                      id="dropdown-custom-quote-link"
                      onClick={() => {
                        handleNavClick('custom');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#FAF7F2] hover:text-[#B83A4B] flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Design Dream Cake
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      id="dropdown-admin-link"
                      onClick={() => {
                        setIsAdminMode(!isAdminMode);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#3E2419] bg-[#FAF3EB] hover:bg-[#F2E6D8] flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#B83A4B]" />
                      {isAdminMode ? 'Exit Admin Dashboard' : 'Switch to Baker Admin'}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="lg:hidden border-t border-[#E8DFD3] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-4 duration-200"
          >
            {/* Pincode Pill Mobile */}
            <div className="pb-3 border-b border-[#E8DFD3]">
              <button
                id="mobile-location-btn"
                onClick={() => {
                  onOpenLocationModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E0D5C7] text-xs font-medium text-[#3E2419]"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#B83A4B]" />
                  <span>
                    Delivering to: <strong>{checkedPincode || 'Select Pincode'}</strong>
                  </span>
                </div>
                <span className="text-[#B83A4B] text-[11px] font-semibold">Change</span>
              </button>
            </div>

            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`mobile-nav-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === link.id
                    ? 'bg-[#EFE8DA] text-[#B83A4B] font-semibold'
                    : 'text-[#4A3D38] hover:bg-[#F5EFE6]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-[#E8DFD3]">
              <button
                id="mobile-admin-toggle-btn"
                onClick={() => {
                  setIsAdminMode(!isAdminMode);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#3E2419] text-white text-xs font-semibold"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                {isAdminMode ? 'Return to Customer Storefront' : 'Open Baker Studio Admin'}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
