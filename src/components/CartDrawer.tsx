import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useBakery } from '../context/BakeryContext';
import { MOCK_ADDONS } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartTotals,
    setActiveTab,
    settings,
    fulfillmentType,
  } = useBakery();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput.trim());
    setCouponFeedback(res);
  };

  const freeDeliveryDeficit = Math.max(
    0,
    settings.deliveryRules.freeDeliveryThreshold - cartTotals.subtotal
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8DFD3] animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FAF0EC] text-[#B83A4B] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#231815]">
                Your Celebration Cart
              </h3>
              <p className="text-[11px] text-[#8C7A74]">
                {cart.length} unique creation{cart.length !== 1 ? 's' : ''} added
              </p>
            </div>
          </div>

          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EFE8DA] text-[#6E5D57] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress Bar (For Delivery) */}
        {fulfillmentType === 'delivery' && (
          <div className="bg-[#FAF3EB] px-4 py-2 border-b border-[#E8DFD3] text-xs">
            {freeDeliveryDeficit > 0 ? (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#5C4D47] font-medium">
                  <span>Add ₹{freeDeliveryDeficit} more for <strong>FREE Delivery</strong></span>
                  <span>Goal: ₹{settings.deliveryRules.freeDeliveryThreshold}</span>
                </div>
                <div className="w-full bg-[#E5DACB] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#B83A4B] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (cartTotals.subtotal / settings.deliveryRules.freeDeliveryThreshold) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="text-emerald-800 font-bold flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unlocked Free Doorstep Hand-Delivery!</span>
              </div>
            )}
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length > 0 ? (
            <>
              <div className="space-y-3">
                {cart.map((item) => {
                  const custom = item.customization;
                  return (
                    <div
                      key={item.id}
                      id={`cart-item-${item.id}`}
                      className="p-3.5 rounded-2xl bg-white border border-[#E5DACB] shadow-xs space-y-3"
                    >
                      {/* Top row: Image, Name, Price & Remove */}
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F2EAE0] shrink-0 border border-[#DDD2C4]">
                          <img
                            src={custom.cakeImage}
                            alt={custom.cakeName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="font-serif font-bold text-sm text-[#231815] leading-tight line-clamp-1">
                              {custom.cakeName}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Quick specs pill */}
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap text-[10px]">
                            <span className="px-1.5 py-0.5 rounded-md bg-[#FAF2EB] text-[#3E2419] font-bold">
                              {custom.weightKg} kg
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold">
                              {custom.eggPreference === 'eggless' ? 'Eggless' : 'With Egg'}
                            </span>
                            <span className="text-[#8C7A74] capitalize">{custom.shape} shape</span>
                          </div>

                          <div className="mt-1 text-xs text-[#5C4D47] font-medium truncate">
                            Flavor: <strong>{custom.flavorName}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Message on Cake if provided */}
                      {custom.cakeMessage && (
                        <div className="text-[11px] p-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] text-[#3E2419] font-serif italic flex items-center gap-1.5">
                          <span className="font-sans font-normal text-[10px] text-[#8C7A74] uppercase tracking-wider not-italic">
                            Piped:
                          </span>
                          "{custom.cakeMessage}"
                        </div>
                      )}

                      {/* Selected Addons preview */}
                      {custom.selectedAddonIds && custom.selectedAddonIds.length > 0 && (
                        <div className="text-[11px] text-[#7A6963] flex items-center gap-1 flex-wrap">
                          <span className="font-semibold text-[#3E2419]">Addons:</span>
                          <span>
                            {custom.selectedAddonIds
                              .map((id) => MOCK_ADDONS.find((a) => a.id === id)?.name)
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>
                      )}

                      {/* Bottom Row: Quantity Stepper & Total */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#F2EAE0]">
                        <div className="flex items-center border border-[#DDD2C4] rounded-lg bg-[#FAF7F2] px-2 py-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-1 hover:text-[#B83A4B]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#231815]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-1 hover:text-[#B83A4B]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-serif font-bold text-sm text-[#231815]">
                            ₹{item.totalPrice.toLocaleString()}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-[#8C7A74] block">
                              (₹{item.unitPrice} each)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon / Promo Code Input */}
              <div className="pt-2">
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        id="cart-coupon-input"
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        placeholder="Coupon (e.g. WELCOME100)"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#DDD2C4] uppercase font-bold tracking-wider text-[#2D2421] focus:ring-1 focus:ring-[#B83A4B]"
                      />
                      <Tag className="w-3.5 h-3.5 text-[#8C7A74] absolute right-3 top-2.5" />
                    </div>
                    <button
                      id="apply-coupon-btn"
                      type="submit"
                      className="px-4 py-2 bg-[#3E2419] hover:bg-[#2B1810] text-white text-xs font-semibold rounded-xl"
                    >
                      Apply
                    </button>
                  </div>

                  {appliedCoupon && (
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                      <span className="font-semibold">
                        Code {appliedCoupon.code} applied (-₹{cartTotals.discount})
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-red-600 hover:underline font-bold text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {couponFeedback && !appliedCoupon && (
                    <p className="text-[11px] text-red-600 font-medium">
                      {couponFeedback.message}
                    </p>
                  )}
                </form>
              </div>

              {/* Clear Cart Button */}
              <div className="text-right">
                <button
                  id="clear-entire-cart-btn"
                  onClick={clearCart}
                  className="text-[11px] text-gray-500 hover:text-red-600 hover:underline"
                >
                  Clear Cart
                </button>
              </div>
            </>
          ) : (
            /* Empty State */
            <div
              id="empty-cart-view"
              className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#FAF0EC] text-[#B83A4B] flex items-center justify-center text-3xl">
                🍰
              </div>
              <h3 className="font-serif font-bold text-lg text-[#231815]">
                Your cart could use something sweet
              </h3>
              <p className="text-xs text-[#6E5D57] max-w-xs leading-relaxed">
                Explore our celebration menu, pick your favorite handcrafted flavor & custom design, and choose self-pickup or doorstep delivery.
              </p>
              <button
                id="empty-cart-explore-btn"
                onClick={() => {
                  onClose();
                  setActiveTab('cakes');
                }}
                className="px-6 py-3 rounded-xl bg-[#B83A4B] hover:bg-[#A23040] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
              >
                <span>Explore Celebration Cakes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer with Price Breakdown & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-[#E8DFD3] shadow-lg space-y-3">
            {/* Bill Details */}
            <div className="space-y-1.5 text-xs text-[#5C4D47]">
              <div className="flex justify-between">
                <span>Cakes & Customization:</span>
                <span className="font-medium text-[#231815]">
                  ₹{cartTotals.subtotal.toLocaleString()}
                </span>
              </div>

              {cartTotals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Savings:</span>
                  <span>-₹{cartTotals.discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery Fee:</span>
                <span className="font-medium text-[#231815]">
                  {fulfillmentType === 'pickup' ? (
                    <span className="text-emerald-700 font-bold">₹0 (Self Pickup)</span>
                  ) : cartTotals.deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `₹${cartTotals.deliveryFee}`
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E8DFD3] flex justify-between text-sm sm:text-base font-serif font-bold text-[#231815]">
                <span>Total Order Amount:</span>
                <span className="text-[#B83A4B]">₹{cartTotals.total.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-[11px] text-[#7A6963] bg-[#FAF7F2] p-2 rounded-lg border border-[#E8DFD3]">
                <span>Advance to Confirm Booking:</span>
                <span className="font-bold text-[#3E2419]">
                  ₹{cartTotals.advancePayable.toLocaleString()} (balance on pickup/delivery)
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#B83A4B] hover:bg-[#A23040] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Proceed to Date & Fulfillment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
