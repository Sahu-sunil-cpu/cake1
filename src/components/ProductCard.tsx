import React from 'react';
import { Heart, Star, Sparkles, Plus, Clock } from 'lucide-react';
import { Cake } from '../types';
import { useBakery } from '../context/BakeryContext';

interface ProductCardProps {
  cake: Cake;
  onCustomize: (cake: Cake) => void;
  onViewDetails: (cake: Cake) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  cake,
  onCustomize,
  onViewDetails,
}) => {
  const { isWishlisted, toggleWishlist } = useBakery();
  const wishlisted = isWishlisted(cake.id);

  return (
    <div
      id={`cake-card-${cake.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E5DACB] hover:border-[#D5C2AF] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EAE0] cursor-pointer" onClick={() => onViewDetails(cake)}>
        <img
          src={cake.images[0]}
          alt={cake.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {cake.isBestseller && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#B83A4B] text-white text-[10px] font-bold tracking-wide uppercase shadow-xs">
              Bestseller
            </span>
          )}
          {cake.isTrending && !cake.isBestseller && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold tracking-wide uppercase shadow-xs">
              Trending
            </span>
          )}
          {cake.isNew && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wide uppercase shadow-xs">
              New Design
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-toggle-${cake.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(cake.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-xs z-10 ${
            wishlisted
              ? 'bg-white text-[#B83A4B]'
              : 'bg-white/80 hover:bg-white text-gray-600 hover:text-[#B83A4B]'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#B83A4B] text-[#B83A4B]' : ''}`} />
        </button>

        {/* Veg / Eggless Indicator badge & Prep Time */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-10">
          <div
            className="flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md border border-emerald-300 shadow-xs text-[10px] font-semibold text-emerald-800"
            title={cake.isEgglessAvailable ? 'Eggless Option Available' : 'Contains Egg'}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            <span>{cake.isEggDefault ? '100% Eggless' : 'Eggless Available'}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/60 text-white px-2 py-0.5 rounded-md text-[10px] font-medium backdrop-blur-xs">
            <Clock className="w-2.5 h-2.5" />
            <span>{cake.minLeadTimeHours}h lead</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating & Category */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-semibold text-[#8C7A74] uppercase tracking-wider">
              {cake.category}
            </span>
            <div className="flex items-center gap-1 text-[#2B1810] font-bold text-xs bg-[#FAF2EB] px-1.5 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{cake.rating.toFixed(1)}</span>
              <span className="text-[#8C7A74] text-[10px]">({cake.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(cake)}
            className="font-serif font-bold text-base text-[#231815] leading-snug hover:text-[#B83A4B] transition-colors cursor-pointer line-clamp-1"
          >
            {cake.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#6E5D57] line-clamp-2 mt-1 leading-relaxed">
            {cake.tagline}
          </p>

          {/* Size previews */}
          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-[#7A6963]">
            <span className="font-semibold text-[#3E2419]">Sizes:</span>
            <span className="truncate">
              {cake.availableWeights.map((w) => `${w.weightKg}kg`).join(' • ')}
            </span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-4 pt-3 border-t border-[#F0E6D8] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#8C7A74] block leading-none">Starting from</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-serif font-bold text-lg text-[#231815]">
                ₹{cake.startingPrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#8C7A74]">/ 0.5kg</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`quick-view-${cake.id}`}
              onClick={() => onViewDetails(cake)}
              className="px-2.5 py-2 text-xs font-semibold text-[#4A3D38] hover:text-[#B83A4B] hover:bg-[#FAF5F0] rounded-xl transition-colors"
            >
              Details
            </button>

            <button
              id={`customize-cake-${cake.id}`}
              onClick={() => onCustomize(cake)}
              className="px-3 py-2 rounded-xl bg-[#B83A4B] hover:bg-[#A23040] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
