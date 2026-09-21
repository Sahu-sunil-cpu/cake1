import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Phone,
} from 'lucide-react';
import {
  FulfillmentType,
  DeliveryAddress,
  PaymentMethod,
  PaymentType,
  Order,
} from '../types';
import { useBakery } from '../context/BakeryContext';
import { MOCK_TIME_SLOTS } from '../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const {
    cart,
    cartTotals,
    settings,
    currentUser,
    savedAddresses,
    saveAddress,
    placeOrder,
    fulfillmentType,
    setFulfillmentType,
    checkedPincode,
    checkPincode,
  } = useBakery();

  // Multi-step state: 1 (Review) -> 2 (Date & Fulfillment) -> 3 (Address / Slots) -> 4 (Payment) -> 5 (Confirmed)
  const [step, setStep] = useState<number>(1);

  // Customer contact info
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Ria Sengupta');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'ria.sengupta@example.com');

  // Date selection (default tomorrow or min lead time)
  const [celebrationDate, setCelebrationDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // Time slot selection
  const [selectedSlot, setSelectedSlot] = useState<string>(MOCK_TIME_SLOTS[3]?.label || '04:00 PM – 06:00 PM');

  // Delivery address state
  const [addressForm, setAddressForm] = useState<DeliveryAddress>(() => {
    return (
      savedAddresses[0] || {
        fullName: 'Ria Sengupta',
        phone: '+91 98765 43210',
        houseFlat: 'Apt 502, Prestige Palms',
        street: '12th Main Road, HAL 2nd Stage',
        locality: 'Indiranagar',
        landmark: 'Near Sony Center',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        type: 'home',
      }
    );
  });

  // Payment choice
  const [paymentType, setPaymentType] = useState<PaymentType>('advance');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Confirmed Order result
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Maximum lead time among items in cart
  const requiredMinLeadTimeHours = Math.max(
    ...cart.map((i) => (i.customization.weightKg > 1.5 ? 24 : 6)),
    6
  );

  const handlePlaceOrder = () => {
    // Validate address if delivery
    if (fulfillmentType === 'delivery') {
      if (!addressForm.houseFlat || !addressForm.street || !addressForm.pincode) {
        alert('Please complete your full delivery address.');
        return;
      }
      checkPincode(addressForm.pincode);
    }

    const created = placeOrder({
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
      },
      fulfillmentType,
      deliveryAddress: fulfillmentType === 'delivery' ? addressForm : undefined,
      celebrationDate,
      timeSlot: selectedSlot,
      paymentMethod,
      paymentType,
      specialNotes,
    });

    setConfirmedOrder(created);
    setStep(5);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }

    onOrderSuccess(created);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        id="checkout-flow-modal"
        className="w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#EBE3D7] overflow-hidden my-auto flex flex-col max-h-[95vh]"
      >
        {/* Step Progress Header */}
        <div className="px-5 py-4 bg-white border-b border-[#E8DFD3] flex items-center justify-between sticky top-0 z-20">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#B83A4B]">
              Step {step} of 4 • Smooth Checkout
            </span>
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#231815]">
              {step === 1 && '1. Review Celebration Order'}
              {step === 2 && '2. Choose Date & Fulfillment'}
              {step === 3 && (fulfillmentType === 'pickup' ? '3. Studio Pickup Details' : '3. Delivery Address & Slots')}
              {step === 4 && '4. Payment & Booking Confirmation'}
              {step === 5 && 'Order Confirmed! 🎂'}
            </h2>
          </div>

          {step !== 5 && (
            <button
              id="close-checkout-modal"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#EFE8DA] text-[#6E5D57] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: REVIEW ORDER */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#E5DACB] flex items-start gap-3"
                  >
                    <img
                      src={item.customization.cakeImage}
                      alt={item.customization.cakeName}
                      className="w-16 h-16 rounded-xl object-cover border border-[#E5DACB] shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-serif font-bold text-sm text-[#231815]">
                        {item.customization.cakeName}
                      </h4>
                      <p className="text-[#5C4D47] mt-0.5">
                        {item.customization.weightKg} kg • {item.customization.flavorName} • {item.customization.shape} shape
                      </p>
                      {item.customization.cakeMessage && (
                        <p className="text-[#8C7A74] italic mt-0.5">
                          "{item.customization.cakeMessage}"
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-xs text-[#231815]">
                        ₹{item.totalPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#8C7A74] block">Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer quick contact confirmation */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5DACB] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#3E2419]">
                  Celebration Host Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5C4D47] mb-1">Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD2C4] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5C4D47] mb-1">WhatsApp Phone</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD2C4] text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CELEBRATION DATE & FULFILLMENT CHOICE */}
          {step === 2 && (
            <div className="space-y-6">
              
              {/* Date Selection */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5DACB] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs uppercase tracking-wider text-[#3E2419] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B83A4B]" />
                    <span>Select Celebration Date</span>
                  </label>
                  <span className="text-[11px] text-[#8C7A74]">
                    Min lead time: {requiredMinLeadTimeHours}h
                  </span>
                </div>
                <input
                  id="checkout-celebration-date"
                  type="date"
                  required
                  value={celebrationDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCelebrationDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#DDD2C4] text-sm text-[#2D2421] font-semibold focus:ring-1 focus:ring-[#B83A4B]"
                />
                <p className="text-[11px] text-[#7A6963]">
                  All our cakes are baked fresh from scratch in Chef Aarti's studio specifically for your celebration date.
                </p>
              </div>

              {/* Prominent Fulfillment Method Cards */}
              <div className="space-y-3">
                <label className="font-bold text-xs uppercase tracking-wider text-[#3E2419] block">
                  How would you like to receive your cake?
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Self Pickup */}
                  <div
                    id="choose-self-pickup-card"
                    onClick={() => setFulfillmentType('pickup')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      fulfillmentType === 'pickup'
                        ? 'bg-[#FAF2EB] border-[#B83A4B] ring-2 ring-[#B83A4B]/20 shadow-md scale-101'
                        : 'bg-white border-[#E0D5C7] hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-base text-[#231815]">Self Pickup</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${fulfillmentType === 'pickup' ? 'border-[#B83A4B] bg-[#B83A4B] text-white' : 'border-gray-300'}`}>
                        {fulfillmentType === 'pickup' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <p className="text-xs text-[#6E5D57] mt-1.5 leading-relaxed">
                      "I'll collect the cake myself from the home studio in Indiranagar."
                    </p>
                    <div className="mt-3 pt-2 border-t border-[#E8DFD3] flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-700">₹0 Delivery Fee</span>
                      <span className="text-[#8C7A74]">Indiranagar Studio</span>
                    </div>
                  </div>

                  {/* Doorstep Delivery */}
                  <div
                    id="choose-home-delivery-card"
                    onClick={() => setFulfillmentType('delivery')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      fulfillmentType === 'delivery'
                        ? 'bg-[#FAF2EB] border-[#B83A4B] ring-2 ring-[#B83A4B]/20 shadow-md scale-101'
                        : 'bg-white border-[#E0D5C7] hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-base text-[#231815]">Home Delivery</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${fulfillmentType === 'delivery' ? 'border-[#B83A4B] bg-[#B83A4B] text-white' : 'border-gray-300'}`}>
                        {fulfillmentType === 'delivery' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <p className="text-xs text-[#6E5D57] mt-1.5 leading-relaxed">
                      "Deliver the cake safely to my address in temperature-controlled transport."
                    </p>
                    <div className="mt-3 pt-2 border-t border-[#E8DFD3] flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#B83A4B]">
                        {cartTotals.subtotal >= settings.deliveryRules.freeDeliveryThreshold ? 'FREE' : `₹${settings.deliveryRules.baseDeliveryFee}`}
                      </span>
                      <span className="text-[#8C7A74]">Timed Hand-Delivery</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: DETAILS (PICKUP OR DELIVERY SLOTS & ADDRESS) */}
          {step === 3 && (
            <div className="space-y-5">
              {fulfillmentType === 'pickup' ? (
                /* Pickup Studio Details */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#E5DACB] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#B83A4B] tracking-wider block">
                          Bakery Studio Pickup Point
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#231815] mt-0.5">
                          {settings.pickupLocation.name}
                        </h4>
                        <p className="text-xs text-[#5C4D47] mt-1">
                          {settings.pickupLocation.address}
                        </p>
                        <p className="text-[11px] text-[#7A6963]">
                          Landmark: {settings.pickupLocation.landmark}
                        </p>
                      </div>
                      <a
                        href={settings.pickupLocation.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#FAF2EB] text-[#B83A4B] text-xs font-semibold hover:bg-[#F4E4D8] flex items-center gap-1 shrink-0"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Maps
                      </a>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] text-xs text-[#5C4D47] space-y-1">
                      <p className="font-semibold text-[#2D2421]">🚗 Safe Pickup Transport Instructions:</p>
                      <p className="text-[11px] leading-relaxed">
                        {settings.pickupLocation.instructions} We recommend keeping the cake box flat on the car floor mat with AC blowing gently.
                      </p>
                    </div>
                  </div>

                  {/* Pickup Slot Selection */}
                  <div className="space-y-2">
                    <label className="font-bold text-xs uppercase tracking-wider text-[#3E2419] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B83A4B]" />
                      <span>Choose Your Preferred Collection Slot</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {MOCK_TIME_SLOTS.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slot.label)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                            selectedSlot === slot.label
                              ? 'bg-[#3E2419] text-white border-[#3E2419]'
                              : 'bg-white text-[#4A3D38] border-[#DDD2C4] hover:bg-[#FAF5F0]'
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Delivery Address & Slots */
                <div className="space-y-4">
                  {/* Address Form */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E5DACB] space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#3E2419]">
                      Doorstep Delivery Address
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#5C4D47] mb-1">House / Flat / Villa No. *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.houseFlat}
                          onChange={(e) => setAddressForm({ ...addressForm, houseFlat: e.target.value })}
                          placeholder="e.g. Apt 502, Orchid Tower"
                          className="w-full px-3 py-2 rounded-xl border border-[#DDD2C4] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#5C4D47] mb-1">Street / Building *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          placeholder="e.g. 100 Feet Road"
                          className="w-full px-3 py-2 rounded-xl border border-[#DDD2C4] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#5C4D47] mb-1">Locality / Area</label>
                        <input
                          type="text"
                          value={addressForm.locality}
                          onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                          placeholder="e.g. Indiranagar"
                          className="w-full px-3 py-2 rounded-xl border border-[#DDD2C4] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#5C4D47] mb-1">Pincode *</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') })}
                          placeholder="560038"
                          className="w-full px-3 py-2 rounded-xl border border-[#DDD2C4] text-xs font-bold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[#5C4D47] mb-1">Landmark</label>
                        <input
                          type="text"
                          value={addressForm.landmark}
                          onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                          placeholder="e.g. Opposite Metro Pillar 42"
                          className="w-full px-3 py-2 rounded-xl border border-[#DDD2C4] text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Slot Selection */}
                  <div className="space-y-2">
                    <label className="font-bold text-xs uppercase tracking-wider text-[#3E2419] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B83A4B]" />
                      <span>Choose Delivery Time Window</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {MOCK_TIME_SLOTS.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slot.label)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                            selectedSlot === slot.label
                              ? 'bg-[#3E2419] text-white border-[#3E2419]'
                              : 'bg-white text-[#4A3D38] border-[#DDD2C4] hover:bg-[#FAF5F0]'
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Special Delivery Notes */}
              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">
                  Delivery / Celebration Note (Optional)
                </label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Surprise birthday party, please don't ring doorbell directly."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs bg-white"
                />
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT OPTIONS & CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-5">
              
              {/* Advance vs Full Payment Toggle */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5DACB] space-y-3">
                <label className="font-bold text-xs uppercase tracking-wider text-[#3E2419] block">
                  Select Payment Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Advance payment option */}
                  <div
                    onClick={() => setPaymentType('advance')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentType === 'advance'
                        ? 'bg-[#FAF2EB] border-[#B83A4B] ring-2 ring-[#B83A4B]/20 shadow-xs'
                        : 'bg-white border-[#DDD2C4]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#231815]">
                        Pay Advance (₹{cartTotals.advancePayable})
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentType === 'advance' ? 'border-[#B83A4B] bg-[#B83A4B] text-white' : 'border-gray-400'}`}>
                        {paymentType === 'advance' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#6E5D57] mt-1">
                      Reserve your baking slot now. Pay remaining ₹{cartTotals.balancePayable} upon pickup/delivery.
                    </p>
                  </div>

                  {/* Full payment option */}
                  <div
                    onClick={() => setPaymentType('full')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentType === 'full'
                        ? 'bg-[#FAF2EB] border-[#B83A4B] ring-2 ring-[#B83A4B]/20 shadow-xs'
                        : 'bg-white border-[#DDD2C4]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#231815]">
                        Pay Full (₹{cartTotals.total})
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentType === 'full' ? 'border-[#B83A4B] bg-[#B83A4B] text-white' : 'border-gray-400'}`}>
                        {paymentType === 'full' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#6E5D57] mt-1">
                      Complete 100% contactless settlement with no hassle on celebration day.
                    </p>
                  </div>

                </div>
              </div>

              {/* Payment Methods */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5DACB] space-y-3">
                <label className="font-bold text-xs uppercase tracking-wider text-[#3E2419] block">
                  Select Payment Method
                </label>

                <div className="space-y-2">
                  {/* UPI */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'upi' ? 'bg-[#FAF2EB] border-[#B83A4B]' : 'bg-white border-[#DDD2C4]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-xs font-bold text-[#231815] block">Instant UPI (GPay, PhonePe, Paytm, BHIM)</span>
                        <span className="text-[10px] text-[#8C7A74]">Fastest & recommended</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#B83A4B]">Fast</span>
                  </div>

                  {/* Cards */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'card' ? 'bg-[#FAF2EB] border-[#B83A4B]' : 'bg-white border-[#DDD2C4]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                      <div>
                        <span className="text-xs font-bold text-[#231815] block">Credit / Debit Card</span>
                        <span className="text-[10px] text-[#8C7A74]">Visa, Mastercard, RuPay</span>
                      </div>
                    </div>
                  </div>

                  {/* Cash on Pickup / Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'cod' ? 'bg-[#FAF2EB] border-[#B83A4B]' : 'bg-white border-[#DDD2C4]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Banknote className="w-4 h-4 text-amber-600" />
                      <div>
                        <span className="text-xs font-bold text-[#231815] block">
                          {fulfillmentType === 'pickup' ? 'Cash on Studio Pickup' : 'Cash on Doorstep Delivery'}
                        </span>
                        <span className="text-[10px] text-[#8C7A74]">Pay when you receive the cake</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="p-4 rounded-2xl bg-[#F4EDE2] border border-[#E5DACB] space-y-1.5 text-xs text-[#5C4D47]">
                <div className="flex justify-between">
                  <span>Order Items ({cart.length}):</span>
                  <span>₹{cartTotals.subtotal.toLocaleString()}</span>
                </div>
                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount:</span>
                    <span>-₹{cartTotals.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery ({fulfillmentType === 'pickup' ? 'Self Pickup' : 'Doorstep'}):</span>
                  <span>{fulfillmentType === 'pickup' ? '₹0' : cartTotals.deliveryFee === 0 ? 'FREE' : `₹${cartTotals.deliveryFee}`}</span>
                </div>
                <div className="pt-1.5 border-t border-[#E8DFD3] flex justify-between font-serif font-bold text-sm text-[#231815]">
                  <span>Total Payable Today:</span>
                  <span className="text-[#B83A4B]">
                    ₹{(paymentType === 'full' ? cartTotals.total : cartTotals.advancePayable).toLocaleString()}
                  </span>
                </div>
                {paymentType === 'advance' && (
                  <p className="text-[11px] text-[#7A6963] pt-1">
                    Remaining balance of ₹{cartTotals.balancePayable} payable upon cake handover.
                  </p>
                )}
              </div>

            </div>
          )}

          {/* STEP 5: ORDER CONFIRMED SCREEN */}
          {step === 5 && confirmedOrder && (
            <div className="text-center space-y-5 py-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl">
                🎂
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full inline-block">
                  Order ID: {confirmedOrder.orderNumber}
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#231815] mt-2">
                  Your Cake Order is Confirmed!
                </h3>
                <p className="text-xs sm:text-sm text-[#5C4D47] mt-1">
                  Chef Aarti has scheduled your bake for <strong>{confirmedOrder.celebrationDate}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8DFD3] text-left text-xs space-y-2 text-[#5C4D47]">
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="font-semibold text-[#231815]">Fulfillment:</span>
                  <span className="font-bold text-[#B83A4B] capitalize">
                    {confirmedOrder.fulfillmentType === 'pickup' ? 'Self Pickup from Indiranagar' : 'Doorstep Delivery'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Slot:</span>
                  <span className="font-medium text-[#231815]">{confirmedOrder.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-emerald-700">₹{confirmedOrder.pricing.advancePaid.toLocaleString()}</span>
                </div>
                {confirmedOrder.pricing.balanceRemaining > 0 && (
                  <div className="flex justify-between">
                    <span>Balance Remaining:</span>
                    <span className="font-bold text-[#231815]">₹{confirmedOrder.pricing.balanceRemaining.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="confirm-track-order-btn"
                  onClick={() => {
                    onClose();
                    onOrderSuccess(confirmedOrder);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#B83A4B] text-white font-semibold text-xs hover:bg-[#A23040]"
                >
                  Track Order Status
                </button>
                <button
                  id="confirm-continue-shopping-btn"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#DDD2C4] text-[#3E2419] font-semibold text-xs hover:bg-[#FAF5F0]"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons (Steps 1 to 4) */}
        {step < 5 && (
          <div className="p-4 bg-white border-t border-[#E8DFD3] flex items-center justify-between gap-3 sticky bottom-0 z-20">
            {step > 1 ? (
              <button
                id="checkout-back-step-btn"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl border border-[#DDD2C4] text-xs font-semibold text-[#4A3D38] hover:bg-[#FAF5F0] flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                id="checkout-next-step-btn"
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 rounded-xl bg-[#3E2419] hover:bg-[#2B1810] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="checkout-pay-confirm-btn"
                onClick={handlePlaceOrder}
                className="px-7 py-3 rounded-xl bg-[#B83A4B] hover:bg-[#A23040] text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 active:scale-98 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Confirm & Pay ₹{(paymentType === 'full' ? cartTotals.total : cartTotals.advancePayable).toLocaleString()}
                </span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
