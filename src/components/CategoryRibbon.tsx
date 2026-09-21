import React from 'react';
import { CATEGORIES_LIST } from '../data/mockData';

interface CategoryRibbonProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryRibbon: React.FC<CategoryRibbonProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-6 border-b border-[#E8DFD3] bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#8C7A74]">Explore Delights</h3>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#231815]">Browse by Category</h2>
          </div>
          <span className="text-xs text-[#6E5D57] hidden sm:block">Scroll horizontally to explore &rarr;</span>
        </div>

        {/* Scrollable ribbon */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-pill-${cat.id.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl whitespace-nowrap text-xs font-semibold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-[#3E2419] text-white border-[#3E2419] shadow-md scale-102'
                    : 'bg-white text-[#4A3D38] border-[#E0D5C7] hover:border-[#B83A4B]/50 hover:bg-[#F9F5EE]'
                }`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-[#F2EAE0] flex items-center justify-center text-xs">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{cat.icon}</span>
                  )}
                </div>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
