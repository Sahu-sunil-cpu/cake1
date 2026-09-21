import React from 'react';
import { Home, Compass, Sparkles, Clock, ShoppingBag } from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

interface MobileBottomNavProps {
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenCart }) => {
  const { activeTab, setActiveTab, cart, orders } = useBakery();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const activeOrdersCount = orders.filter((o) => !['completed', 'cancelled'].includes(o.orderStatus)).length;

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'cakes', label: 'Explore', icon: Compass },
    { id: 'custom', label: 'Customize', icon: Sparkles, highlight: true },
    { id: 'dashboard', label: 'Orders', icon: Clock, badge: activeOrdersCount > 0 ? activeOrdersCount : undefined },
  ];

  const handleSelect = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      id="mobile-bottom-bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8DFD3] px-2 py-1 shadow-lg"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-bottom-${item.id}`}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-[#B83A4B]' : 'text-[#6E5D57] hover:text-[#2D2421]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Cart button in bottom bar */}
        <button
          id="mobile-bottom-cart-btn"
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[#3E2419] relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[2.2px] text-[#B83A4B]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2.5 px-1 min-w-4 h-4 rounded-full bg-[#B83A4B] text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5 text-[#B83A4B]">Cart</span>
        </button>
      </div>
    </nav>
  );
};
