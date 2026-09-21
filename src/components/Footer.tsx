import React from 'react';
import { Heart, MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles, Instagram, Facebook } from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsAdminMode, isAdminMode, settings } = useBakery();

  return (
    <footer id="bakery-footer" className="bg-[#231815] text-[#D8CCC4] pt-14 pb-20 md:pb-12 border-t border-[#3E2D27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#3E2D27]">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🍰</span>
              <span className="font-serif font-bold text-xl text-white tracking-tight">
                The Little Whisk
              </span>
            </div>
            <p className="text-xs text-[#BFAFA7] leading-relaxed">
              An artisan home bakery studio founded by Chef Aarti Sharma in Indiranagar, Bengaluru. Crafting honest celebration cakes from scratch using pure dairy butter, Callebaut chocolate, and zero artificial premixes.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[#D8CCC4]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#B83A4B] flex items-center justify-center transition-colors text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#B83A4B] flex items-center justify-center transition-colors text-white"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Studio Pickup & Studio Hours */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Studio & Hours
            </h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#B83A4B] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">{settings.pickupLocation.name}</p>
                <p className="text-[#BFAFA7]">{settings.pickupLocation.address}</p>
                <p className="text-[#8C7A74] text-[11px] mt-0.5">{settings.pickupLocation.landmark}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <Clock className="w-4 h-4 text-[#B83A4B] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Baking & Collection Hours</p>
                <p className="text-[#BFAFA7]">Monday – Sunday: 09:30 AM – 09:00 PM</p>
                <p className="text-[#8C7A74] text-[11px]">Bespoke pickup slots available by appointment</p>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Explore Store
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('cakes')}
                  className="hover:text-white transition-colors"
                >
                  All Celebration Cakes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('custom')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#B83A4B]" />
                  <span>Design Dream Cake</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-white transition-colors"
                >
                  About Chef Aarti & Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Track My Order & Quotations
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Quality & Delivery Areas */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Bengaluru Delivery Hubs
            </h4>
            <p className="text-[#BFAFA7] leading-relaxed">
              Indiranagar • Koramangala • Domlur • HAL • Ulsoor • MG Road • Richmond Town • HSR Layout • Bellandur • Whitefield
            </p>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1 mt-3">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>FSSAI Registered Home Kitchen</span>
              </div>
              <p className="text-[10px] text-[#A69791]">
                Registration: 21223190000412. Baked in a pet-free, strictly sanitized kitchen.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C7A74]">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} The Little Whisk Bakery. Handcrafted with love in Bengaluru.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="hover:text-[#B83A4B] underline transition-colors"
            >
              {isAdminMode ? 'Customer View' : 'Baker Portal Login'}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
