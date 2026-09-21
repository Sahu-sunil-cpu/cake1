import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Check, Heart, Award, Clock } from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

interface HeroSectionProps {
  onOpenLocationModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLocationModal }) => {
  const { setActiveTab, checkedPincode, checkPincode, deliveryEligibility, settings } = useBakery();
  const [quickPincode, setQuickPincode] = useState(checkedPincode);
  const [checkedMessage, setCheckedMessage] = useState<string | null>(null);

  const handleQuickCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPincode.trim()) return;
    const ok = checkPincode(quickPincode.trim());
    if (ok) {
      setCheckedMessage(`We deliver to ${quickPincode.trim()}! Next-day slots open.`);
    } else {
      setCheckedMessage(`Delivery unavailable at ${quickPincode.trim()}, but Self Pickup is available!`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F2EB] to-[#FAF7F2] pt-6 pb-12 md:py-16 border-b border-[#E8DFD3]">
      {/* Subtle decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F4DDD4]/40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#EFE0C9]/40 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Small Brand Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E0D5C7] shadow-xs text-xs font-semibold text-[#3E2419]">
              <span className="flex h-2 w-2 rounded-full bg-[#B83A4B]"></span>
              <span>Made Fresh for Your Celebration • Home Studio Bakes</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#231815] tracking-tight leading-[1.15]">
              Freshly Baked. <br />
              <span className="text-[#B83A4B] italic">Beautifully</span> Crafted.
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-[#5C4D47] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore handcrafted artisan cakes baked with pure dairy butter and couverture chocolate in our sanitized home kitchen. Customize your dream flavor, message & shape — with convenient <strong>Self Pickup</strong> or <strong>Doorstep Delivery</strong>.
            </p>

            {/* Quick Delivery Checker Widget */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-[#E5DACB] max-w-lg mx-auto lg:mx-0">
              <div className="text-xs font-semibold text-[#3E2419] mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B83A4B]" />
                  Where should we deliver your cake?
                </span>
                <span className="text-[11px] text-[#8C7A74]">Pickup always open</span>
              </div>
              <form onSubmit={handleQuickCheck} className="flex gap-2">
                <input
                  id="hero-pincode-input"
                  type="text"
                  maxLength={6}
                  value={quickPincode}
                  onChange={(e) => {
                    setQuickPincode(e.target.value.replace(/\D/g, ''));
                    setCheckedMessage(null);
                  }}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-[#DDD2C4] focus:outline-none focus:ring-2 focus:ring-[#B83A4B]/40 focus:border-[#B83A4B]"
                />
                <button
                  id="hero-check-pin-btn"
                  type="submit"
                  className="px-4 py-2 bg-[#3E2419] hover:bg-[#2B1810] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                >
                  Check
                </button>
              </form>

              {checkedMessage && (
                <div
                  className={`mt-2 text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    deliveryEligibility === 'serviceable'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {deliveryEligibility === 'serviceable' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  )}
                  <span>{checkedMessage}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-explore-cakes-btn"
                onClick={() => setActiveTab('cakes')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#B83A4B] hover:bg-[#A23040] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore Celebration Cakes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-design-cake-btn"
                onClick={() => setActiveTab('custom')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-[#FAF5F0] text-[#3E2419] border border-[#DDD2C4] font-semibold text-sm shadow-xs hover:border-[#B83A4B] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#B83A4B]" />
                <span>Design Your Dream Cake</span>
              </button>
            </div>

            {/* Trust Pills Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E8DFD3] text-left">
              <div className="flex items-center gap-2 text-xs text-[#5C4D47]">
                <div className="w-6 h-6 rounded-full bg-[#F5E6E0] flex items-center justify-center text-[#B83A4B] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Freshly Baked to Order</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#5C4D47]">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  🌱
                </div>
                <span>100% Eggless Available</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#5C4D47]">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span>Pickup & Timed Slots</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#5C4D47]">
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span>Pure Callebaut & Butter</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Cake Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Circular / Arch Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] group">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85"
                  alt="Artisan Belgian Chocolate Drip Cake"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-white/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs">
                      <img
                        src="https://images.unsplash.com/photo-1557925923-cd4648e211a0?auto=format&fit=crop&w=200&q=80"
                        alt="Vintage Lambeth"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#231815] leading-tight">Vintage Lambeth Ribbon</h4>
                      <p className="text-[11px] text-[#7A6963]">Hand-piped buttercream ruffles</p>
                    </div>
                  </div>
                  <button
                    id="hero-bestseller-quick-view"
                    onClick={() => setActiveTab('cakes')}
                    className="px-3 py-1.5 bg-[#B83A4B] text-white text-[11px] font-semibold rounded-lg shadow-xs hover:bg-[#A23040]"
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Floating Review Badge */}
              <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-[#E8DFD3] flex items-center gap-2.5 animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                  ★
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#231815]">4.9 / 5.0</span>
                    <span className="text-[10px] text-[#8C7A74]">(490+ reviews)</span>
                  </div>
                  <p className="text-[10px] text-[#5C4D47] font-medium">Certified 5-Star Home Baker</p>
                </div>
              </div>

              {/* Floating Studio Pickup Badge */}
              <div className="absolute -bottom-3 -right-3 bg-[#3E2419] text-white px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <div className="text-left">
                  <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">Home Kitchen</p>
                  <p className="text-xs font-bold">Studio Pickup Ready</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
