import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, X, Navigation } from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

interface LocationCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationCheckerModal: React.FC<LocationCheckerModalProps> = ({ isOpen, onClose }) => {
  const { checkedPincode, checkPincode, deliveryEligibility, settings } = useBakery();
  const [inputPincode, setInputPincode] = useState(checkedPincode);
  const [hasChecked, setHasChecked] = useState(false);

  if (!isOpen) return null;

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPincode.trim()) return;
    checkPincode(inputPincode.trim());
    setHasChecked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="location-checker-card"
        className="w-full max-w-md bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#EBE3D7] overflow-hidden p-6"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F5E6E0] flex items-center justify-center text-[#B83A4B]">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2D2421]">Check Delivery Availability</h3>
          </div>
          <button
            id="close-location-checker"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EFE8DA] text-[#6E5D57] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#6E5D57] mt-3">
          Where should we deliver your cake? Enter your 6-digit delivery pincode to check instant availability.
        </p>

        <form onSubmit={handleCheck} className="mt-4 space-y-3">
          <div className="relative">
            <input
              id="pincode-input"
              type="text"
              maxLength={6}
              value={inputPincode}
              onChange={(e) => {
                setInputPincode(e.target.value.replace(/\D/g, ''));
                setHasChecked(false);
              }}
              placeholder="e.g. 560038"
              className="w-full px-4 py-3 pl-11 rounded-xl bg-white border border-[#DDD2C4] text-[#2D2421] placeholder-[#A69791] text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#B83A4B]/40 focus:border-[#B83A4B]"
            />
            <MapPin className="w-5 h-5 text-[#8C7A74] absolute left-3.5 top-3.5" />
          </div>

          <button
            id="check-pincode-button"
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#B83A4B] hover:bg-[#A23040] text-white font-medium text-sm transition-all shadow-md active:scale-98"
          >
            Check Availability
          </button>
        </form>

        {hasChecked && (
          <div className="mt-4 p-3.5 rounded-xl border transition-all animate-in fade-in duration-200">
            {deliveryEligibility === 'serviceable' ? (
              <div className="flex items-start gap-3 text-emerald-900 bg-emerald-50 border-emerald-200 p-3 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-800">Great news! We deliver to your area.</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Doorstep delivery is available in pincode <strong>{inputPincode}</strong> with scheduled time slots.
                    Standard delivery fee is ₹{settings.deliveryRules.baseDeliveryFee} (Free above ₹{settings.deliveryRules.freeDeliveryThreshold}).
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 text-amber-900 bg-amber-50 border-amber-200 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-800">Doorstep delivery currently not available here.</h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    However, you can still choose <strong>Self Pickup</strong> from our studio in {settings.pickupLocation.city}!
                    Many customers collect their cakes safely via car.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 p-3 rounded-xl bg-[#F4EDE2] border border-[#E5DACB] flex items-center justify-between text-xs text-[#6E5D57]">
          <div>
            <span className="font-semibold text-[#3E2419]">Self Pickup Location:</span>
            <p className="text-[#6E5D57]">{settings.pickupLocation.address}</p>
          </div>
          <a
            href={settings.pickupLocation.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#B83A4B] font-semibold hover:underline shrink-0 ml-2"
          >
            <Navigation className="w-3.5 h-3.5" />
            Directions
          </a>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E8DFD3] flex justify-end">
          <button
            id="done-pincode-btn"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#2D2421] text-white hover:bg-[#40332F] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
