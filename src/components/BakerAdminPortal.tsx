import React, { useState } from 'react';
import {
  ChefHat,
  Package,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useBakery } from '../context/BakeryContext';
import { Order, CustomCakeRequest } from '../types';

export const BakerAdminPortal: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    updateOrderPaymentStatus,
    customRequests,
    respondToCustomRequest,
    settings,
    updateSettings,
    setIsAdminMode,
  } = useBakery();

  const [adminTab, setAdminTab] = useState<'orders' | 'quotes' | 'settings'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed'>('active');

  // Quotation form modal/state
  const [activeQuoteRequest, setActiveQuoteRequest] = useState<CustomCakeRequest | null>(null);
  const [quotePrice, setQuotePrice] = useState<string>('');
  const [bakerNotes, setBakerNotes] = useState<string>('');

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'active') return o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled';
    if (orderFilter === 'completed') return o.orderStatus === 'completed';
    return true;
  });

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuoteRequest || !quotePrice) return;

    respondToCustomRequest(
      activeQuoteRequest.id,
      Number(quotePrice),
      bakerNotes || 'Custom handcrafted recipe prepared with pure dairy butter and premium ingredients.'
    );

    setActiveQuoteRequest(null);
    setQuotePrice('');
    setBakerNotes('');
    alert('Quotation has been submitted and sent to the customer dashboard!');
  };

  return (
    <div id="baker-admin-portal" className="py-8 bg-[#F4EDE4] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Baker Top Banner */}
        <div className="bg-[#231815] text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#B83A4B] text-white flex items-center justify-center shadow-md">
              <ChefHat className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-bold tracking-wider">
                  Baker's Command Center
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-xs text-emerald-300">Live Kitchen Active</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                Chef Aarti Sharma's Studio
              </h1>
              <p className="text-xs text-[#DDD2C4]">
                Indiranagar, Bengaluru • {orders.length} Total Orders • {customRequests.length} Custom Requests
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminMode(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-colors"
            >
              Exit to Customer Storefront
            </button>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#DDD2C4] pb-3 overflow-x-auto">
          <button
            onClick={() => setAdminTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              adminTab === 'orders'
                ? 'bg-[#3E2419] text-white shadow-xs'
                : 'bg-white text-[#5C4D47] border border-[#DDD2C4]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Celebration Orders Queue ({orders.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('quotes')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              adminTab === 'quotes'
                ? 'bg-[#3E2419] text-white shadow-xs'
                : 'bg-white text-[#5C4D47] border border-[#DDD2C4]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Custom Design Quotes ({customRequests.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              adminTab === 'settings'
                ? 'bg-[#3E2419] text-white shadow-xs'
                : 'bg-white text-[#5C4D47] border border-[#DDD2C4]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Bakery Settings & Delivery Rules</span>
          </button>
        </div>

        {/* TAB 1: ORDER QUEUE */}
        {adminTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrderFilter('active')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    orderFilter === 'active' ? 'bg-[#B83A4B] text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  Active Bakes ({orders.filter((o) => o.orderStatus !== 'completed').length})
                </button>
                <button
                  onClick={() => setOrderFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    orderFilter === 'completed' ? 'bg-[#B83A4B] text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  Completed ({orders.filter((o) => o.orderStatus === 'completed').length})
                </button>
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    orderFilter === 'all' ? 'bg-[#B83A4B] text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  All Orders ({orders.length})
                </button>
              </div>

              <span className="text-xs text-[#6E5D57]">
                Click status pill to advance production pipeline
              </span>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  id={`admin-order-card-${order.id}`}
                  className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E5DACB] space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0E6D8]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-[#231815]">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-xs font-semibold text-[#8C7A74]">
                          • Customer: <strong>{order.customer.name}</strong> ({order.customer.phone})
                        </span>
                      </div>
                      <p className="text-xs text-[#6E5D57] mt-0.5">
                        Celebration Date: <strong className="text-[#B83A4B]">{order.celebrationDate}</strong> • Slot: <strong>{order.timeSlot}</strong>
                      </p>
                    </div>

                    {/* Status Pill Switcher */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8C7A74] font-semibold">Stage:</span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['orderStatus'])}
                        className="px-3 py-1.5 rounded-xl border border-[#DDD2C4] text-xs font-bold text-[#3E2419] bg-[#FAF2EB] focus:ring-1 focus:ring-[#B83A4B]"
                      >
                        <option value="placed">Order Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="baking">In the Oven / Baking</option>
                        <option value="decorating">Artisan Decorating</option>
                        <option value="ready_for_pickup">Ready for Pickup</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="completed">Completed / Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Items & Custom Specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] flex gap-3 text-xs"
                      >
                        <img
                          src={item.customization.cakeImage}
                          alt={item.customization.cakeName}
                          className="w-14 h-14 rounded-xl object-cover border shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#231815] truncate">{item.customization.cakeName}</h4>
                          <p className="text-[#5C4D47]">
                            {item.customization.weightKg} kg • {item.customization.flavorName} • {item.customization.shape} shape
                          </p>
                          {item.customization.cakeMessage && (
                            <p className="text-[#B83A4B] italic font-serif mt-0.5">
                              Message: "{item.customization.cakeMessage}"
                            </p>
                          )}
                          {item.customization.specialInstructions && (
                            <p className="text-[#7A6963] text-[11px] mt-0.5">
                              Notes: {item.customization.specialInstructions}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-[#231815]">₹{item.totalPrice}</span>
                          <span className="text-[10px] text-gray-500 block">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom: Fulfillment details & Payment */}
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5C4D47] border-t border-[#F0E6D8]">
                    <div>
                      <span className="font-bold text-[#3E2419] capitalize">
                        {order.fulfillmentType === 'pickup' ? '🚗 Studio Self Pickup' : '🚚 Doorstep Delivery'}
                      </span>
                      {order.deliveryAddress && (
                        <p className="text-[11px] text-[#7A6963]">
                          {order.deliveryAddress.houseFlat}, {order.deliveryAddress.street}, {order.deliveryAddress.locality}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-gray-500">Total: ₹{order.pricing.total}</span>
                        <span className="text-emerald-700 font-bold ml-2">Paid: ₹{order.pricing.advancePaid}</span>
                        {order.pricing.balanceRemaining > 0 && (
                          <span className="text-amber-700 font-bold ml-2">Bal: ₹{order.pricing.balanceRemaining}</span>
                        )}
                      </div>

                      {order.pricing.balanceRemaining > 0 && (
                        <button
                          onClick={() => updateOrderPaymentStatus(order.id, 'paid')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
                        >
                          Mark Balance Collected
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM REQUEST QUOTATIONS */}
        {adminTab === 'quotes' && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#231815]">
              Customer Bespoke Design Requests ({customRequests.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E5DACB] space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#B83A4B]">
                        #{req.requestNumber} • {req.occasion}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#231815] mt-0.5">
                        {req.cakeType}
                      </h4>
                      <p className="text-[#7A6963]">
                        Customer: <strong>{req.customerName}</strong> ({req.phone})
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF2EB] text-[#3E2419] capitalize">
                      {req.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-1 text-[#5C4D47]">
                    <p><strong>Required Date:</strong> {req.requiredDate} ({req.preferredTime})</p>
                    <p><strong>Guests & Size:</strong> {req.guestsCount} guests • {req.weight}</p>
                    <p><strong>Flavor & Diet:</strong> {req.flavor} • {req.eggPreference}</p>
                    <p><strong>Customer Budget:</strong> {req.budget}</p>
                    {req.description && (
                      <p className="pt-1 text-[#231815]">"{req.description}"</p>
                    )}
                  </div>

                  {/* Reference photos */}
                  {req.referenceImages && req.referenceImages.length > 0 && (
                    <div>
                      <span className="font-bold text-[#3E2419] block mb-1">Customer Photos:</span>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {req.referenceImages.map((src, i) => (
                          <img key={i} src={src} alt="Ref" className="w-16 h-16 rounded-xl object-cover border" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quotation Action */}
                  <div className="pt-2 border-t border-[#F0E6D8] flex items-center justify-between">
                    {req.quotedPrice ? (
                      <div className="text-emerald-800 font-bold">
                        Quoted: ₹{req.quotedPrice.toLocaleString()}
                      </div>
                    ) : (
                      <span className="text-amber-700 font-semibold">Needs Quotation</span>
                    )}

                    <button
                      onClick={() => {
                        setActiveQuoteRequest(req);
                        setQuotePrice(req.quotedPrice ? String(req.quotedPrice) : '3200');
                        setBakerNotes(req.bakerNotes || '');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#B83A4B] text-white text-xs font-semibold hover:bg-[#A23040]"
                    >
                      {req.quotedPrice ? 'Edit Quotation' : 'Prepare & Send Quote'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STORE SETTINGS & AVAILABILITY */}
        {adminTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E5DACB] space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#231815] pb-2 border-b border-[#F0E6D8]">
              Bakery Operations & Fulfillment Settings
            </h3>

            {/* Accepting Orders Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#231815] block">Online Ordering Status</span>
                <p className="text-xs text-[#6E5D57]">Toggle to temporarily pause new online celebration orders</p>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ isAcceptingOrders: !settings.isAcceptingOrders })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  settings.isAcceptingOrders
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {settings.isAcceptingOrders ? 'Accepting Orders' : 'Store Paused'}
              </button>
            </div>

            {/* Minimum lead time */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#3E2419] block">Standard Minimum Baking Lead Time (Hours)</label>
              <input
                type="number"
                value={settings.minLeadTimeHours ?? settings.leadTimeHours.standard}
                onChange={(e) => updateSettings({ minLeadTimeHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#DDD2C4]"
              />
            </div>

            {/* Free Delivery Threshold */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#3E2419] block">Free Delivery Order Threshold (₹)</label>
              <input
                type="number"
                value={settings.deliveryRules.freeDeliveryThreshold}
                onChange={(e) =>
                  updateSettings({
                    deliveryRules: {
                      ...settings.deliveryRules,
                      freeDeliveryThreshold: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#DDD2C4]"
              />
            </div>

            {/* Studio Pickup Location */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-[#3E2419] block">Studio Pickup Address & Instructions</label>
              <input
                type="text"
                value={settings.pickupLocation.address}
                onChange={(e) =>
                  updateSettings({
                    pickupLocation: {
                      ...settings.pickupLocation,
                      address: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#DDD2C4]"
              />
              <textarea
                rows={2}
                value={settings.pickupLocation.instructions}
                onChange={(e) =>
                  updateSettings({
                    pickupLocation: {
                      ...settings.pickupLocation,
                      instructions: e.target.value,
                    },
                  })
                }
                className="w-full p-3 rounded-xl border border-[#DDD2C4]"
              />
            </div>

            <p className="text-xs text-emerald-700 font-semibold">
              ✓ All bakery setting changes save automatically to local storage.
            </p>
          </div>
        )}

        {/* Modal: Prepare Quotation */}
        {activeQuoteRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#E8DFD3] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="font-serif font-bold text-lg text-[#231815]">
                  Prepare Official Quotation
                </h3>
                <button onClick={() => setActiveQuoteRequest(null)} className="p-1 text-gray-400 hover:text-black">
                  ✕
                </button>
              </div>

              <p className="text-xs text-[#5C4D47]">
                Sending quotation for <strong>#{activeQuoteRequest.requestNumber} ({activeQuoteRequest.cakeType})</strong> for customer <strong>{activeQuoteRequest.customerName}</strong>.
              </p>

              <form onSubmit={handleSendQuote} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#3E2419] block mb-1">Quoted Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    placeholder="e.g. 3200"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2419] block mb-1">Chef Aarti's Notes & Inclusions</label>
                  <textarea
                    rows={3}
                    value={bakerNotes}
                    onChange={(e) => setBakerNotes(e.target.value)}
                    placeholder="e.g. Price includes hand-painted watercolor finish, internal food-grade dowels, and customized acrylic name topper."
                    className="w-full p-3 rounded-xl border border-[#DDD2C4]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveQuoteRequest(null)}
                    className="px-4 py-2 rounded-xl border text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#B83A4B] text-white font-semibold hover:bg-[#A23040]"
                  >
                    Send Quotation to Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
