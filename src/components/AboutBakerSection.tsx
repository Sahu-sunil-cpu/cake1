import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Award,
  ChevronDown,
  Star,
  Quote,
  CheckCircle,
} from 'lucide-react';
import { MOCK_REVIEWS } from '../data/mockData';
import { useBakery } from '../context/BakeryContext';

export const AboutBakerSection: React.FC = () => {
  const { setActiveTab } = useBakery();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How much notice is needed for a cake order?',
      a: 'Our signature bento and classic round cakes require a minimum lead time of 6 to 12 hours. Elaborate theme, tiered, and custom fondant cakes require 24 to 48 hours notice so sponge rests properly and decorations are sculpted to perfection.',
    },
    {
      q: 'Are your eggless cakes soft and moist?',
      a: 'Yes, absolutely! Over 70% of our orders are eggless. We use European buttermilk curd cultures and natural emulsifiers to create sponges that are extraordinarily light, moist, and melt-in-the-mouth without any eggy aftertaste.',
    },
    {
      q: 'How does Self Pickup from the Indiranagar studio work?',
      a: 'When your cake is boxed and chilled, you will receive an SMS and WhatsApp notification. You can pull up right to B-402 Gardenia Haven in Indiranagar. We hand over the cake in a reinforced, travel-ready box and instruct you on car transport (always keep on the flat floor with AC on!).',
    },
    {
      q: 'Do you deliver across Bengaluru?',
      a: 'Yes! We deliver across Indiranagar, Koramangala, Whitefield, HSR Layout, Bellandur, JP Nagar, and central Bengaluru in temperature-guarded vehicles with dedicated cake couriers.',
    },
    {
      q: 'Can you replicate a Pinterest cake design?',
      a: 'Yes! Chef Aarti specializes in bringing bespoke concepts to life. Use our "Design Dream Cake" tab to upload your inspiration photos, select your guest count, and receive a transparent quotation.',
    },
  ];

  return (
    <div id="about-baker-section" className="py-16 bg-[#F7F3EB] border-t border-[#E8DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Baker Story Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* Left: Chef Portrait & Visual Accent */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#EFE8DA] max-w-md mx-auto">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1000&auto=format&fit=crop&q=80"
                alt="Chef Aarti Sharma at work in bakery studio"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Credential Badge */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white p-4 rounded-2xl shadow-xl border border-[#E5DACB] max-w-xs flex items-center gap-3 animate-in fade-in duration-300">
              <div className="w-11 h-11 rounded-xl bg-[#FAF0EC] text-[#B83A4B] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#231815] block">Chef Aarti Sharma</span>
                <span className="text-[#6E5D57]">Le Cordon Bleu Trained • 8+ Years of Artisan Craft</span>
              </div>
            </div>
          </div>

          {/* Right: Story Text & Values */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E0D5C7] text-xs font-semibold text-[#B83A4B]">
              <Heart className="w-3.5 h-3.5 fill-[#B83A4B]" />
              <span>Baked with Deep Reverence for Celebrations</span>
            </div>

            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#231815] leading-tight">
              "Every celebration deserves a cake baked from scratch, not pulled from a cold warehouse shelf."
            </h2>

            <p className="text-sm text-[#5C4D47] leading-relaxed">
              Welcome to <strong>The Little Whisk</strong>. What began as a passionate obsession with French entremets and Korean minimalist piping in my Indiranagar kitchen has blossomed into a cherished boutique studio for Bengaluru’s special moments.
            </p>

            <p className="text-sm text-[#5C4D47] leading-relaxed">
              Unlike commercial industrial bakeries that churn hundreds of uniform sponges using premixes and shelf-life stabilizers, we bake in small batches. When you place an order, your eggs are cracked fresh, pure unsalted dairy butter is whipped, and 54% Callebaut Belgian chocolate is melted just for you.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-2xl bg-white border border-[#E5DACB] flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#231815] block">100% Pure Butter</span>
                  <span className="text-[#7A6963]">Zero hydrogenated fats or cheap palm oils.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#E5DACB] flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#231815] block">Real Belgian Chocolate</span>
                  <span className="text-[#7A6963]">Genuine Callebaut cocoa & dark ganache.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#E5DACB] flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#231815] block">Gentle Sweetness</span>
                  <span className="text-[#7A6963]">Balanced sugar so delicate flavors shine.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#E5DACB] flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#231815] block">Sanitized Studio</span>
                  <span className="text-[#7A6963]">Strict hygiene, glove-only decorating.</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="story-custom-btn"
                onClick={() => setActiveTab('custom')}
                className="px-6 py-3 rounded-xl bg-[#3E2419] text-white text-xs font-semibold hover:bg-[#2B1810] shadow-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Talk with Chef Aarti About a Custom Cake</span>
              </button>
            </div>
          </div>

        </div>

        {/* Customer Reviews Section */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase font-bold text-[#B83A4B] tracking-wider">
              Heartfelt Memories
            </span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#231815] mt-1">
              Loved by Bengaluru Families
            </h3>
            <p className="text-xs sm:text-sm text-[#6E5D57] mt-1">
              Read real stories from birthdays, proposals, anniversaries, and family celebrations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 shadow-xs border border-[#E8DFD3] flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#8C7A74]">{rev.date}</span>
                  </div>

                  <p className="text-xs text-[#5C4D47] leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0E6D8] mt-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#231815] block">{rev.customerName}</span>
                    <span className="text-[10px] text-[#8C7A74]">{rev.customerCity}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#B83A4B] bg-[#FAF2EB] px-2 py-0.5 rounded-md">
                    {rev.cakeName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4 pt-6">
          <div className="text-center mb-6">
            <span className="text-xs uppercase font-bold text-[#B83A4B] tracking-wider">
              Common Questions
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#231815] mt-1">
              Everything You Need to Know
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E5DACB] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between font-serif font-bold text-sm text-[#231815]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8C7A74] transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#B83A4B]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#5C4D47] leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
