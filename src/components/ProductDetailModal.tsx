import React, { useState } from 'react';
import { X, Star, Sparkles, Clock, ShieldCheck, Heart, Users, ChevronRight, AlertTriangle } from 'lucide-react';
import { Cake } from '../types';
import { useBakery } from '../context/BakeryContext';

interface ProductDetailModalProps {
  cake: Cake | null;
  onClose: () => void;
  onCustomize: (cake: Cake) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  cake,
  onClose,
  onCustomize,
}) => {
  const { isWishlisted, toggleWishlist } = useBakery();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!cake) return null;

  const wishlisted = isWishlisted(cake.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        id="product-detail-card"
        className="w-full max-w-4xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#EBE3D7] overflow-hidden my-auto flex flex-col md:flex-row max-h-[92vh]"
      >
        {/* Left: Image Gallery */}
        <div className="md:w-1/2 p-4 sm:p-6 flex flex-col justify-between bg-white border-b md:border-b-0 md:border-r border-[#E8DFD3]">
          <div>
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xs border border-[#E5DACB] bg-[#F2EAE0]">
              <img
                src={cake.images[selectedImageIndex] || cake.images[0]}
                alt={cake.name}
                className="w-full h-full object-cover"
              />
              <button
                id="modal-wishlist-toggle"
                onClick={() => toggleWishlist(cake.id)}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:text-[#B83A4B] shadow-sm transition-all"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#B83A4B] text-[#B83A4B]' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {cake.images.length > 1 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                {cake.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx ? 'border-[#B83A4B] ring-2 ring-[#B83A4B]/20 scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${cake.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Home Studio Quality Promise Badge */}
          <div className="mt-4 p-3 rounded-2xl bg-[#F7F3EB] border border-[#E8DFD3] text-xs text-[#5C4D47] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-[#2D2421]">Sanitized Home Kitchen</p>
              <p className="text-[11px] text-[#7A6963]">Baked from scratch using Callebaut chocolate & pure dairy butter.</p>
            </div>
          </div>
        </div>

        {/* Right: Cake Info, Specs & Actions */}
        <div className="md:w-1/2 p-5 sm:p-6 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header / Category & Close */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#B83A4B]">
                  {cake.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#231815] mt-1 leading-snug">
                  {cake.name}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1 text-[#2B1810] font-bold text-xs bg-[#FAF2EB] px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{cake.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-[#7A6963]">({cake.reviewCount} customer reviews)</span>
                  <span className="text-[#DDD2C4]">•</span>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                    {cake.isEggDefault ? '100% Eggless' : 'Eggless Available'}
                  </span>
                </div>
              </div>

              <button
                id="close-product-detail-modal"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#EFE8DA] text-[#6E5D57] transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Starting price & lead time */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8DFD3]">
              <div>
                <span className="text-[10px] text-[#8C7A74] uppercase tracking-wider block">Starting Price</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-serif font-bold text-2xl text-[#231815]">
                    ₹{cake.startingPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#8C7A74]">/ 0.5kg</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#8C7A74] uppercase tracking-wider block">Baking Lead Time</span>
                <span className="text-xs font-bold text-[#3E2419] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#B83A4B]" />
                  {cake.minLeadTimeHours} hours minimum
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-[#2D2421] uppercase tracking-wider mb-1">About This Cake</h4>
              <p className="text-xs sm:text-sm text-[#5C4D47] leading-relaxed">
                {cake.description}
              </p>
            </div>

            {/* Serving Guide */}
            <div>
              <h4 className="text-xs font-bold text-[#2D2421] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#B83A4B]" />
                Serving Guide & Recommended Sizes
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {cake.availableWeights.map((w) => (
                  <div key={w.weightKg} className="p-2 rounded-xl bg-white border border-[#E5DACB]">
                    <span className="font-bold text-[#3E2419] block">{w.weightKg} kg</span>
                    <span className="text-[11px] text-[#7A6963]">{w.servingEstimate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients & Allergens */}
            <div className="pt-2 border-t border-[#E8DFD3] space-y-1.5 text-xs text-[#6E5D57]">
              <div>
                <span className="font-semibold text-[#3E2419]">Ingredients: </span>
                <span>{cake.ingredients.join(', ')}</span>
              </div>
              <div className="flex items-start gap-1 text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded-xl border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Allergen Info:</strong> {cake.allergens.join(', ')}. Made in a kitchen handling dairy, gluten & nuts.
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-5 mt-4 border-t border-[#E8DFD3] flex items-center gap-3">
            <button
              id="detail-customize-cake-btn"
              onClick={() => {
                onClose();
                onCustomize(cake);
              }}
              className="flex-1 py-3.5 px-4 rounded-xl bg-[#B83A4B] hover:bg-[#A23040] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Customize Cake (Flavors, Weight & Message)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
