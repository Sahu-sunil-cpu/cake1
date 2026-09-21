import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { OCCASIONS_LIST } from '../data/mockData';
import { useBakery } from '../context/BakeryContext';

interface OccasionCardsProps {
  onSelectOccasion: (occasion: string) => void;
}

export const OccasionCards: React.FC<OccasionCardsProps> = ({ onSelectOccasion }) => {
  const { setActiveTab } = useBakery();

  const handleCardClick = (occasionName: string) => {
    onSelectOccasion(occasionName);
    setActiveTab('cakes');
  };

  return (
    <section className="py-10 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#B83A4B]">Celebrating Life</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#231815] mt-1">Shop by Occasion</h2>
            <p className="text-xs sm:text-sm text-[#6E5D57] mt-1">
              Curated recipes, themes & toppers tailored to each milestone.
            </p>
          </div>
          <button
            id="view-all-occasions-btn"
            onClick={() => setActiveTab('cakes')}
            className="mt-3 sm:mt-0 text-xs font-bold text-[#B83A4B] hover:text-[#A23040] flex items-center gap-1 self-start sm:self-auto"
          >
            Explore All Occasions &rarr;
          </button>
        </div>

        {/* Grid of occasions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {OCCASIONS_LIST.map((occ) => (
            <div
              key={occ.id}
              id={`occasion-card-${occ.id.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleCardClick(occ.name)}
              className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all border border-[#E5DACB]"
            >
              <img
                src={occ.image}
                alt={occ.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"></div>

              {/* Card content */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-white flex items-end justify-between">
                <div>
                  <span className="text-lg mb-1 block">{occ.icon}</span>
                  <h3 className="font-serif font-bold text-sm sm:text-base leading-tight group-hover:text-[#F7DDD4] transition-colors">
                    {occ.name}
                  </h3>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">{occ.subtitle}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:bg-[#B83A4B] group-hover:text-white transition-colors shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
