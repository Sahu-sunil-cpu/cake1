import React, { useState } from 'react';
import {
  Package,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  Heart,
  FileText,
  CheckCircle2,
  AlertCircle,
  Truck,
  Download,
  Share2,
} from 'lucide-react';
import { useBakery } from '../context/BakeryContext';
import { Order, CustomCakeRequest, Cake } from '../types';

interface CustomerDashboardProps {
  onCustomizeCake: (cake: Cake) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onCustomizeCake,
}) => {
  const {
    orders,
    customRequests,
    wishlistIds,
    cakes,
    setActiveTab,
    settings,
    currentUser,
  } = useBakery();

  const [activeTab, setActiveDashboardTab] = useState<'orders' | 'custom-quotes' | 'wishlist'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  const wishlistedCakes = cakes.filter((c) => wishlistIds.includes(c.id));

  // Order status stepper calculation
  const getStatusStep = (status: Order['orderStatus']) => {
    switch (status) {
      case 'placed':
        return 1;
      case 'confirmed':
        return 2;
      case 'baking':
        return 3;
      case 'decorating':
        return 4;
      case 'ready_for_pickup':
      case 'out_for_delivery':
      case 'ready':
        return 5;
      case 'completed':
      case 'delivered':
      case 'picked_up':
        return 6;
      default:
        return 1;
    }
  };

  const steps = [
    { num: 1, label: 'Order Placed' },
    { num: 2, label: 'Confirmed' },
    { num: 3, label: 'In the Oven' },
    { num: 4, label: 'Artisan Decorating' },
    { num: 5, label: 'Ready / Out' },
    { num: 6, label: 'Delivered' },
  ];

  return (
    <div id="customer-dashboard-page" className="py-10 bg-[#FAF7F2] min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card / Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8DFD3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF0EC] text-[#B83A4B] font-serif font-bold text-2xl flex items-center justify-center border border-[#F4DDD2]">
              {currentUser?.name ? currentUser.name.charAt(0) : 'R'}
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#8C7A74] uppercase tracking-wider">
                Celebration Account
              </span>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#231815]">
                Welcome, {currentUser?.name || 'Ria'}
              </h1>
              <p className="text-xs text-[#6E5D57]">
                {currentUser?.phone || '+91 98765 43210'} • {currentUser?.email || 'ria@example.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('cakes')}
              className="px-4 py-2.5 rounded-xl bg-[#3E2419] text-white text-xs font-semibold hover:bg-[#2B1810]"
            >
              Order New Cake
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className="px-4 py-2.5 rounded-xl bg-[#B83A4B] text-white text-xs font-semibold hover:bg-[#A23040] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Design Dream Cake</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8DFD3] pb-3 mb-6">
          <button
            id="tab-my-orders"
            onClick={() => setActiveDashboardTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#3E2419] text-white shadow-xs'
                : 'text-[#6E5D57] hover:bg-[#F2EAE0]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            id="tab-custom-quotes"
            onClick={() => setActiveDashboardTab('custom-quotes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'custom-quotes'
                ? 'bg-[#3E2419] text-white shadow-xs'
                : 'text-[#6E5D57] hover:bg-[#F2EAE0]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Custom Quotations ({customRequests.length})</span>
          </button>

          <button
            id="tab-wishlist"
            onClick={() => setActiveDashboardTab('wishlist')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'bg-[#3E2419] text-white shadow-xs'
                : 'text-[#6E5D57] hover:bg-[#F2EAE0]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Favorites ({wishlistedCakes.length})</span>
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Orders List Sidebar */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-[#231815]">All Orders</h3>
              {orders.length > 0 ? (
                orders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      id={`order-list-card-${order.id}`}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white border-[#B83A4B] shadow-md ring-1 ring-[#B83A4B]/20'
                          : 'bg-white/80 border-[#E5DACB] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-[#3E2419]">#{order.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.orderStatus === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'baking' || order.orderStatus === 'decorating'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {order.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="font-serif font-bold text-sm text-[#231815] line-clamp-1">
                        {order.items.map((i) => i.customization.cakeName).join(', ')}
                      </div>

                      <div className="text-xs text-[#6E5D57] mt-1 flex items-center justify-between">
                        <span>Date: {order.celebrationDate}</span>
                        <span className="font-bold text-[#3E2419]">₹{order.pricing.total}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center bg-white rounded-2xl border border-[#E8DFD3] text-xs text-[#6E5D57]">
                  No orders placed yet.
                </div>
              )}
            </div>

            {/* Selected Order Detailed Tracking View */}
            <div className="lg:col-span-2">
              {selectedOrder ? (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8DFD3] space-y-6">
                  
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DFD3]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#B83A4B]">
                          Order #{selectedOrder.orderNumber}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-[#7A6963]">
                          Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 className="font-serif font-bold text-xl text-[#231815] mt-0.5">
                        Celebration for {selectedOrder.celebrationDate}
                      </h2>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#8C7A74] block">Fulfillment</span>
                      <span className="text-xs font-bold text-[#3E2419] capitalize">
                        {selectedOrder.fulfillmentType === 'pickup' ? 'Studio Self Pickup' : 'Doorstep Delivery'}
                      </span>
                    </div>
                  </div>

                  {/* Visual Status Stepper */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#3E2419] mb-4">
                      Live Kitchen & Fulfillment Progress
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {steps.map((st) => {
                        const currentStepNum = getStatusStep(selectedOrder.orderStatus);
                        const isDone = currentStepNum >= st.num;
                        const isCurrent = currentStepNum === st.num;

                        return (
                          <div
                            key={st.num}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isCurrent
                                ? 'bg-[#FAF2EB] border-[#B83A4B] text-[#B83A4B] font-bold shadow-xs'
                                : isDone
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-[#FAF7F2] border-[#E8DFD3] text-gray-400'
                            }`}
                          >
                            <div className="w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center text-[10px] font-bold border">
                              {isDone ? '✓' : st.num}
                            </div>
                            <span className="text-[10px] leading-tight block">{st.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items in Order */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#3E2419]">
                      Cakes & Artisan Customizations
                    </h4>

                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] flex flex-col sm:flex-row items-start gap-4"
                      >
                        <img
                          src={item.customization.cakeImage}
                          alt={item.customization.cakeName}
                          className="w-20 h-20 rounded-xl object-cover border border-[#E0D5C7] shrink-0"
                        />
                        <div className="flex-1 text-xs space-y-1">
                          <h5 className="font-serif font-bold text-sm text-[#231815]">
                            {item.customization.cakeName}
                          </h5>
                          <p className="text-[#5C4D47]">
                            {item.customization.weightKg} kg • {item.customization.flavorName} • {item.customization.shape} shape
                          </p>
                          <p className="text-[#5C4D47]">
                            Frosting: {item.customization.frosting} • Egg: {item.customization.eggPreference}
                          </p>
                          {item.customization.cakeMessage && (
                            <p className="text-[#B83A4B] italic font-serif">
                              "{item.customization.cakeMessage}"
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-serif font-bold text-base text-[#231815]">
                            ₹{item.totalPrice.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#8C7A74] block">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pickup / Delivery Information Details */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E5DACB] space-y-2 text-xs">
                    <h4 className="font-bold uppercase tracking-wider text-[#3E2419]">
                      Fulfillment Instructions & Schedule
                    </h4>
                    <p className="text-[#5C4D47]">
                      <strong>Scheduled Slot:</strong> {selectedOrder.timeSlot} on {selectedOrder.celebrationDate}
                    </p>

                    {selectedOrder.fulfillmentType === 'pickup' ? (
                      <div className="text-[#5C4D47]">
                        <p><strong>Pickup Address:</strong> {settings.pickupLocation.name}, {settings.pickupLocation.address}</p>
                        <p className="text-[#8C7A74] mt-0.5">Instructions: {settings.pickupLocation.instructions}</p>
                      </div>
                    ) : (
                      <div className="text-[#5C4D47]">
                        <p><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress?.houseFlat}, {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.locality}, {selectedOrder.deliveryAddress?.city} - {selectedOrder.deliveryAddress?.pincode}</p>
                      </div>
                    )}
                  </div>

                  {/* Payment Breakdown */}
                  <div className="p-4 rounded-2xl bg-[#FAF2EB] border border-[#E8DFD3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="font-bold text-[#3E2419] block">
                        Payment Method: {selectedOrder.paymentMethod ? selectedOrder.paymentMethod.toUpperCase() : 'UPI'}
                      </span>
                      <span className="text-[#6E5D57]">
                        Advance Paid: <strong>₹{selectedOrder.pricing.advancePaid}</strong> • Balance Remaining: <strong>₹{selectedOrder.pricing.balanceRemaining}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Printing official digital invoice receipt for Order #${selectedOrder.orderNumber}`)}
                        className="px-4 py-2 rounded-xl border border-[#DDD2C4] bg-white hover:bg-gray-50 text-xs font-semibold text-[#3E2419] flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-3xl border border-[#E8DFD3] text-sm text-[#6E5D57]">
                  Select an order to view live baking updates.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: CUSTOM QUOTATIONS */}
        {activeTab === 'custom-quotes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#231815]">
                Custom Cake Requests & Baker Quotes
              </h3>
              <button
                onClick={() => setActiveTab('custom')}
                className="px-4 py-2 rounded-xl bg-[#B83A4B] text-white text-xs font-semibold hover:bg-[#A23040] flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Submit New Concept</span>
              </button>
            </div>

            {customRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customRequests.map((req) => (
                  <div
                    key={req.id}
                    id={`custom-request-card-${req.id}`}
                    className="p-5 rounded-3xl bg-white border border-[#E5DACB] shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B83A4B]">
                          Request #{req.requestNumber}
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#231815] mt-0.5">
                          {req.cakeType}
                        </h4>
                        <p className="text-xs text-[#7A6963]">
                          {req.occasion} • {req.weight} • {req.guestsCount} guests
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        req.status === 'quote_sent'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'quote_accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-50 text-blue-800'
                      }`}>
                        {req.status === 'quote_sent' ? 'Quote Ready' : req.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] text-xs space-y-1 text-[#5C4D47]">
                      <p><strong>Required Date:</strong> {req.requiredDate} ({req.preferredTime})</p>
                      <p><strong>Flavor:</strong> {req.flavor}</p>
                      {req.message && <p><strong>Message:</strong> "{req.message}"</p>}
                    </div>

                    {/* Baker Quotation Section */}
                    {req.quotedPrice ? (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900">Chef Aarti's Official Quotation</span>
                          <span className="font-serif font-bold text-base text-emerald-900">
                            ₹{req.quotedPrice.toLocaleString()}
                          </span>
                        </div>
                        {req.bakerNotes && (
                          <p className="text-[11px] text-emerald-800 italic">
                            "{req.bakerNotes}"
                          </p>
                        )}
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[10px] text-emerald-700">Advance booking: 40%</span>
                          {req.status !== 'quote_accepted' && (
                            <button
                              onClick={() => {
                                alert(`Quote accepted! Advance payment link generated for Request #${req.requestNumber}`);
                              }}
                              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs"
                            >
                              Accept & Book
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                        Chef Aarti is currently reviewing your reference photos and calculation. You will receive a quotation within 2–4 hours.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#E8DFD3] text-sm text-[#6E5D57]">
                You haven't submitted any custom design requests yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            <h3 className="font-serif font-bold text-lg text-[#231815] mb-4">
              Your Saved Favorites ({wishlistedCakes.length})
            </h3>

            {wishlistedCakes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {wishlistedCakes.map((cake) => (
                  <div
                    key={cake.id}
                    className="p-4 rounded-3xl bg-white border border-[#E5DACB] shadow-xs flex items-center gap-4"
                  >
                    <img
                      src={cake.images[0]}
                      alt={cake.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-[#E0D5C7]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-sm text-[#231815] truncate">
                        {cake.name}
                      </h4>
                      <p className="text-xs text-[#7A6963] mt-0.5">
                        From ₹{cake.startingPrice}
                      </p>
                      <button
                        onClick={() => onCustomizeCake(cake)}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-[#B83A4B] text-white text-xs font-semibold hover:bg-[#A23040]"
                      >
                        Customize Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#E8DFD3] text-sm text-[#6E5D57]">
                You haven't saved any cakes to your favorites yet. Tap the heart icon on any cake to save it!
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
