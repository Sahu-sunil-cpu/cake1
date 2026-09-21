import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles, X, ChevronDown } from 'lucide-react';
import { Cake } from '../types';
import { ProductCard } from './ProductCard';
import { useBakery } from '../context/BakeryContext';

interface CakeCatalogProps {
  initialCategory?: string;
  initialOccasion?: string;
  searchQuery?: string;
  onCustomize: (cake: Cake) => void;
  onViewDetails: (cake: Cake) => void;
}

export const CakeCatalog: React.FC<CakeCatalogProps> = ({
  initialCategory = 'all',
  initialOccasion = 'all',
  searchQuery: externalSearch = '',
  onCustomize,
  onViewDetails,
}) => {
  const { cakes, setActiveTab } = useBakery();

  const [searchTerm, setSearchTerm] = useState(externalSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedOccasion, setSelectedOccasion] = useState(initialOccasion);
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [priceBracket, setPriceBracket] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync external search if provided
  React.useEffect(() => {
    if (externalSearch) setSearchTerm(externalSearch);
  }, [externalSearch]);

  const filteredCakes = useMemo(() => {
    return cakes
      .filter((cake) => {
        // Search term matching
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = cake.name.toLowerCase().includes(q);
          const matchDesc = cake.description.toLowerCase().includes(q);
          const matchCat = cake.category.toLowerCase().includes(q);
          const matchFlavor = cake.availableFlavors.some((f) => f.name.toLowerCase().includes(q));
          const matchOccasion = cake.occasions.some((o) => o.toLowerCase().includes(q));
          const matchTagline = cake.tagline.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat && !matchFlavor && !matchOccasion && !matchTagline) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'Eggless Cakes') {
            if (!cake.isEgglessAvailable) return false;
          } else if (cake.category !== selectedCategory) {
            return false;
          }
        }

        // Occasion filter
        if (selectedOccasion !== 'all') {
          if (!cake.occasions.includes(selectedOccasion)) return false;
        }

        // Eggless toggle
        if (egglessOnly && !cake.isEgglessAvailable) {
          return false;
        }

        // Price bracket
        if (priceBracket === 'under-600' && cake.startingPrice > 600) return false;
        if (priceBracket === '600-1000' && (cake.startingPrice < 600 || cake.startingPrice > 1000)) return false;
        if (priceBracket === '1000-2000' && (cake.startingPrice < 1000 || cake.startingPrice > 2000)) return false;
        if (priceBracket === 'above-2000' && cake.startingPrice < 2000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price-high') return b.startingPrice - a.startingPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'popular') return b.reviewCount - a.reviewCount;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        // Default recommended
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [cakes, searchTerm, selectedCategory, selectedOccasion, egglessOnly, priceBracket, sortBy]);

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'Birthday Cakes', label: 'Birthday' },
    { id: 'Chocolate Cakes', label: 'Chocolate' },
    { id: 'Designer Cakes', label: 'Designer' },
    { id: 'Bento Cakes', label: 'Bento & Mini' },
    { id: 'Wedding Cakes', label: 'Wedding' },
    { id: 'Red Velvet Cakes', label: 'Red Velvet' },
    { id: 'Fruit Cakes', label: 'Fresh Fruit' },
    { id: 'Cheesecakes', label: 'Cheesecakes' },
    { id: 'Cupcakes', label: 'Cupcakes' },
  ];

  const occasions = [
    'all',
    'Birthday',
    'Anniversary',
    'Wedding',
    'Engagement',
    'Kids Birthday',
    'Baby Shower',
    'Congratulations',
    'Festivals',
  ];

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedOccasion('all');
    setEgglessOnly(false);
    setPriceBracket('all');
    setSortBy('recommended');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedOccasion !== 'all' ||
    egglessOnly ||
    priceBracket !== 'all' ||
    searchTerm.trim() !== '';

  return (
    <div id="cake-catalog-section" className="py-8 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8DFD3]">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#B83A4B]">Artisan Menu</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#231815]">Explore Celebration Cakes</h1>
            <p className="text-xs sm:text-sm text-[#6E5D57] mt-0.5">
              Showing {filteredCakes.length} handcrafted bakes ready to be personalized
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-80 relative">
            <input
              id="catalog-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search flavors, themes, bento..."
              className="w-full px-4 py-2.5 pl-10 rounded-2xl bg-white border border-[#DDD2C4] text-xs sm:text-sm text-[#2D2421] placeholder-[#A69791] focus:outline-none focus:ring-2 focus:ring-[#B83A4B]/40 focus:border-[#B83A4B]"
            />
            <Search className="w-4 h-4 text-[#8C7A74] absolute left-3.5 top-3" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 absolute right-2.5 top-2.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters and Sort Bar */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-3">
          
          {/* Category Chips Ribbon */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`filter-cat-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#3E2419] text-white shadow-xs'
                    : 'bg-white text-[#5C4D47] border border-[#E0D5C7] hover:bg-[#F2EAE0]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Eggless toggle + Sort */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Eggless toggle */}
            <button
              id="filter-eggless-toggle"
              onClick={() => setEgglessOnly(!egglessOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                egglessOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-[#4A3D38] border-[#E0D5C7] hover:bg-emerald-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${egglessOnly ? 'bg-white' : 'bg-emerald-600'}`}></span>
              <span>100% Eggless</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort cakes by"
                className="appearance-none bg-white text-[#3E2419] font-medium text-xs px-3 py-1.5 pr-8 rounded-xl border border-[#E0D5C7] focus:outline-none focus:ring-1 focus:ring-[#B83A4B] cursor-pointer"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Designs</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C7A74] absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              id="open-more-filters-btn"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden p-1.5 rounded-xl bg-white border border-[#E0D5C7] text-[#3E2419]"
              title="More Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Extended Filter Bar (Occasion & Price) */}
        <div className={`pt-2 pb-4 ${mobileFilterOpen ? 'block' : 'hidden md:flex'} items-center gap-4 flex-wrap text-xs text-[#5C4D47]`}>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#3E2419]">Occasion:</span>
            <select
              id="catalog-occasion-select"
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              aria-label="Filter cakes by occasion"
              className="bg-white border border-[#E0D5C7] rounded-lg px-2.5 py-1 text-xs text-[#3E2419]"
            >
              <option value="all">All Occasions</option>
              {occasions.filter((o) => o !== 'all').map((occ) => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#3E2419]">Price Bracket:</span>
            <select
              id="catalog-price-bracket-select"
              value={priceBracket}
              onChange={(e) => setPriceBracket(e.target.value)}
              aria-label="Filter cakes by price bracket"
              className="bg-white border border-[#E0D5C7] rounded-lg px-2.5 py-1 text-xs text-[#3E2419]"
            >
              <option value="all">Any Price</option>
              <option value="under-600">Under ₹600 (Bento & Minis)</option>
              <option value="600-1000">₹600 – ₹1,000</option>
              <option value="1000-2000">₹1,000 – ₹2,000</option>
              <option value="above-2000">Above ₹2,000 (Multi-tier)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              id="clear-all-filters-btn"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#B83A4B] hover:underline ml-auto flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Products Grid or Empty State */}
        {filteredCakes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 mt-4">
            {filteredCakes.map((cake) => (
              <ProductCard
                key={cake.id}
                cake={cake}
                onCustomize={onCustomize}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            id="empty-catalog-state"
            className="my-12 py-16 text-center bg-white rounded-3xl border border-[#E8DFD3] p-8 max-w-xl mx-auto shadow-xs"
          >
            <div className="w-16 h-16 rounded-full bg-[#FAF0EC] text-[#B83A4B] flex items-center justify-center mx-auto text-2xl mb-4">
              🎂
            </div>
            <h3 className="font-serif font-bold text-xl text-[#231815]">
              We couldn't find that cake.
            </h3>
            <p className="text-sm text-[#6E5D57] mt-2 max-w-md mx-auto">
              Try modifying your search or filters, or tell us your unique design concept! Chef Aarti creates fully customized theme and wedding cakes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <button
                id="empty-reset-btn"
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs font-semibold text-[#3E2419] hover:bg-[#FAF5F0]"
              >
                Clear All Filters
              </button>
              <button
                id="empty-custom-cake-btn"
                onClick={() => setActiveTab('custom')}
                className="px-5 py-2.5 rounded-xl bg-[#B83A4B] hover:bg-[#A23040] text-white text-xs font-semibold shadow-sm flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Design Custom Dream Cake</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
