import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  Users,
  Send,
  HelpCircle,
} from 'lucide-react';
import { EggPreference, FulfillmentType } from '../types';
import { useBakery } from '../context/BakeryContext';

export const CustomCakeBuilder: React.FC = () => {
  const {
    submitCustomRequest,
    setActiveTab,
    currentUser,
    settings,
    checkedPincode,
  } = useBakery();

  // Form State
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [occasion, setOccasion] = useState('Birthday');
  const [cakeType, setCakeType] = useState('');
  const [flavor, setFlavor] = useState('Belgian Dark Chocolate Truffle');
  const [weight, setWeight] = useState('1.5 kg (2-tier or wide)');
  const [guestsCount, setGuestsCount] = useState<number>(15);
  const [eggPreference, setEggPreference] = useState<EggPreference>('eggless');
  const [shape, setShape] = useState('Round');
  const [theme, setTheme] = useState('');
  const [preferredColors, setPreferredColors] = useState('');
  const [message, setMessage] = useState('');
  const [requiredDate, setRequiredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('04:00 PM – 06:00 PM');
  const [budget, setBudget] = useState('₹2,000 – ₹3,500');
  const [description, setDescription] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [submittedRequestNumber, setSubmittedRequestNumber] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setReferenceImages((prev) => [...prev, evt.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !cakeType || !requiredDate) {
      alert('Please provide your name, phone number, design concept, and required celebration date.');
      return;
    }

    const created = submitCustomRequest({
      customerName,
      phone,
      email: email || 'not-provided@example.com',
      occasion,
      cakeType,
      flavor,
      weight,
      guestsCount,
      eggPreference,
      shape,
      theme,
      preferredColors,
      message,
      requiredDate,
      preferredTime,
      budget,
      description,
      referenceImages,
      fulfillmentType,
      deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
      specialInstructions,
    });

    setSubmittedRequestNumber(created.requestNumber);
  };

  if (submittedRequestNumber) {
    return (
      <div className="py-16 bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center px-4">
        <div
          id="custom-request-success-card"
          className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl border border-[#E8DFD3] text-center space-y-4 animate-in fade-in duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl">
            ✨
          </div>

          <span className="text-xs uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
            Request #{submittedRequestNumber} Submitted
          </span>

          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#231815]">
            Chef Aarti has received your design!
          </h2>

          <p className="text-sm text-[#5C4D47] leading-relaxed">
            Thank you, <strong>{customerName}</strong>! Our head baker will review your design concept, guests count, and reference images. You will receive a quotation with exact pricing and advance booking details within <strong>2–4 hours</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] text-xs text-left space-y-1.5 text-[#5C4D47]">
            <p><strong>Celebration Date:</strong> {requiredDate} ({preferredTime})</p>
            <p><strong>Fulfillment:</strong> {fulfillmentType === 'pickup' ? `Self Pickup from ${settings.pickupLocation.city} Studio` : 'Doorstep Hand-Delivery'}</p>
            <p><strong>Concept:</strong> {cakeType}</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="view-custom-in-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#3E2419] text-white font-semibold text-xs hover:bg-[#2B1810]"
            >
              Track Request in Dashboard
            </button>
            <button
              id="return-to-catalog-btn"
              onClick={() => setActiveTab('cakes')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#DDD2C4] text-[#3E2419] font-semibold text-xs hover:bg-[#FAF5F0]"
            >
              Browse Ready Cakes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="custom-cake-builder-page" className="py-10 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E0D5C7] text-xs font-semibold text-[#B83A4B] mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Quotations & Artisanal Tiers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#231815]">
            Design Your Dream Cake
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5D57] mt-2">
            Have a Pinterest pin, theme, character, or multi-tiered wedding concept? Share your ideas and Chef Aarti will craft a custom recipe & quotation for you.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#E8DFD3] space-y-8"
        >
          {/* Section A: Contact Details */}
          <div>
            <h3 className="font-serif font-bold text-lg text-[#231815] pb-2 border-b border-[#E8DFD3] mb-4">
              1. Your Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ria Sengupta"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421] focus:ring-1 focus:ring-[#B83A4B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421] focus:ring-1 focus:ring-[#B83A4B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ria@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421] focus:ring-1 focus:ring-[#B83A4B]"
                />
              </div>
            </div>
          </div>

          {/* Section B: Occasion & Concept */}
          <div>
            <h3 className="font-serif font-bold text-lg text-[#231815] pb-2 border-b border-[#E8DFD3] mb-4">
              2. Occasion & Design Concept
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">Occasion</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421] bg-white"
                >
                  <option>Birthday</option>
                  <option>1st Birthday</option>
                  <option>Anniversary</option>
                  <option>Wedding</option>
                  <option>Engagement</option>
                  <option>Baby Shower</option>
                  <option>Corporate Event</option>
                  <option>Other Celebration</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">
                  Cake Concept / Theme Title *
                </label>
                <input
                  type="text"
                  required
                  value={cakeType}
                  onChange={(e) => setCakeType(e.target.value)}
                  placeholder="e.g. Two-tier Pastel Safari Animal with Giraffe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">
                  Detailed Design Description & Vision
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your design, tiers, elements, color palettes, figurines, or personal touches you have in mind..."
                  className="w-full p-3 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421]"
                />
              </div>
            </div>
          </div>

          {/* Section C: Flavors, Weight & Guests */}
          <div>
            <h3 className="font-serif font-bold text-lg text-[#231815] pb-2 border-b border-[#E8DFD3] mb-4">
              3. Flavors, Size & Diet
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">Flavor Preference</label>
                <input
                  type="text"
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  placeholder="e.g. Belgian Truffle or Rose Pistachio"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">Estimated Guests Count</label>
                <div className="relative">
                  <input
                    type="number"
                    min={2}
                    max={200}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421]"
                  />
                  <Users className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">Egg Preference</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEggPreference('eggless')}
                    className={`flex-1 py-2 px-2 text-xs font-semibold rounded-xl border ${
                      eggPreference === 'eggless'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-white border-[#DDD2C4] text-gray-700'
                    }`}
                  >
                    100% Eggless
                  </button>
                  <button
                    type="button"
                    onClick={() => setEggPreference('with-egg')}
                    className={`flex-1 py-2 px-2 text-xs font-semibold rounded-xl border ${
                      eggPreference === 'with-egg'
                        ? 'bg-[#FAF2EB] border-[#B83A4B] text-[#3E2419]'
                        : 'bg-white border-[#DDD2C4] text-gray-700'
                    }`}
                  >
                    With Egg
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">Silhouette / Shape</label>
                <input
                  type="text"
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                  placeholder="e.g. Two-tier Round, Heart, Hexagon"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">Expected Budget Range</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421] bg-white"
                >
                  <option>₹1,500 – ₹2,500 (1.0 – 1.5 kg)</option>
                  <option>₹2,500 – ₹4,000 (2.0 – 2.5 kg tier)</option>
                  <option>₹4,000 – ₹6,500 (3.0 – 4.0 kg grand)</option>
                  <option>₹6,500+ (Regal 3-tier wedding / gala)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">Message on Cake</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Wild One Ayaan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421]"
                />
              </div>
            </div>
          </div>

          {/* Section D: Reference Photos Upload */}
          <div>
            <h3 className="font-serif font-bold text-lg text-[#231815] pb-2 border-b border-[#E8DFD3] mb-4 flex items-center justify-between">
              <span>4. Upload Inspiration / Reference Images</span>
              <span className="text-xs font-sans font-normal text-[#8C7A74]">Up to 5 images</span>
            </h3>

            <div className="border-2 border-dashed border-[#DDD2C4] hover:border-[#B83A4B] rounded-2xl p-6 text-center transition-colors bg-[#FAF7F2]">
              <input
                id="custom-builder-file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label
                htmlFor="custom-builder-file-input"
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-xs text-[#B83A4B] flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-[#3E2419]">
                  Click to upload photos from Pinterest, Instagram, or camera
                </span>
                <span className="text-[11px] text-[#8C7A74]">Supports JPG, PNG, WEBP</span>
              </label>

              {referenceImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[#E8DFD3] justify-center">
                  {referenceImages.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-xs border border-[#DDD2C4]">
                      <img src={src} alt={`Ref ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section E: Date, Time & Fulfillment */}
          <div>
            <h3 className="font-serif font-bold text-lg text-[#231815] pb-2 border-b border-[#E8DFD3] mb-4">
              5. Celebration Date & Fulfillment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">
                  Required Celebration Date *
                </label>
                <input
                  type="date"
                  required
                  value={requiredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">
                  Preferred Pickup / Delivery Time Slot
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421] bg-white"
                >
                  <option>10:00 AM – 12:00 PM</option>
                  <option>12:00 PM – 02:00 PM</option>
                  <option>02:00 PM – 04:00 PM</option>
                  <option>04:00 PM – 06:00 PM</option>
                  <option>06:00 PM – 08:00 PM (Evening)</option>
                  <option>08:00 PM – 09:30 PM (Night Rush)</option>
                </select>
              </div>
            </div>

            {/* Fulfillment choice cards */}
            <label className="text-xs font-semibold text-[#3E2419] block mb-2">
              How would you like to receive your cake?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Pickup card */}
              <div
                onClick={() => setFulfillmentType('pickup')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  fulfillmentType === 'pickup'
                    ? 'bg-[#FAF2EB] border-[#B83A4B] ring-2 ring-[#B83A4B]/20 shadow-xs'
                    : 'bg-white border-[#E0D5C7] hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#231815]">Self Pickup from Studio</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${fulfillmentType === 'pickup' ? 'border-[#B83A4B] bg-[#B83A4B] text-white' : 'border-gray-400'}`}>
                    {fulfillmentType === 'pickup' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <p className="text-xs text-[#6E5D57] mt-1">
                  Collect safely from Chef Aarti's sanitized studio in {settings.pickupLocation.city}. We pack all cakes in reinforced travel cartons.
                </p>
                <div className="mt-2 text-[11px] font-semibold text-[#B83A4B]">
                  No delivery charge • Direct Handover
                </div>
              </div>

              {/* Delivery card */}
              <div
                onClick={() => setFulfillmentType('delivery')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  fulfillmentType === 'delivery'
                    ? 'bg-[#FAF2EB] border-[#B83A4B] ring-2 ring-[#B83A4B]/20 shadow-xs'
                    : 'bg-white border-[#E0D5C7] hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#231815]">Doorstep Hand-Delivery</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${fulfillmentType === 'delivery' ? 'border-[#B83A4B] bg-[#B83A4B] text-white' : 'border-gray-400'}`}>
                    {fulfillmentType === 'delivery' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <p className="text-xs text-[#6E5D57] mt-1">
                  Delivered directly to your venue or home in safe temperature-controlled transport.
                </p>
                <div className="mt-2 text-[11px] font-semibold text-emerald-700">
                  Serviceable in Bengaluru areas
                </div>
              </div>

            </div>

            {fulfillmentType === 'delivery' && (
              <div className="mt-4">
                <label className="text-xs font-semibold text-[#3E2419] block mb-1">
                  Delivery Venue / Address & Landmark
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House/Villa no, Street, Locality, Landmark, City & Pincode..."
                  className="w-full p-3 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421]"
                />
              </div>
            )}
          </div>

          {/* Section F: Special notes */}
          <div>
            <label className="text-xs font-semibold text-[#3E2419] block mb-1">
              Anything else Chef Aarti should know?
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Mild sweetness please, bride loves dried lavender, allergic to peanuts."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2C4] text-xs text-[#2D2421]"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#E8DFD3] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#6E5D57] text-center sm:text-left">
              <span className="font-semibold text-[#231815]">No payment required upfront.</span>
              <p>Chef Aarti will send a transparent quotation for your review within 2–4 hours.</p>
            </div>

            <button
              id="submit-custom-quote-btn"
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#B83A4B] hover:bg-[#A23040] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Custom Cake Request</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
