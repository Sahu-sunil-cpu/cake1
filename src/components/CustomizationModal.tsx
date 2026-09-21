import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Check,
  Upload,
  Plus,
  Minus,
  AlertCircle,
  HelpCircle,
  Heart,
  Square,
  Circle,
  RectangleHorizontal,
  ChevronRight,
} from 'lucide-react';
import {
  Cake,
  CakeShape,
  EggPreference,
  FrostingType,
  SweetnessLevel,
  CakeCustomization,
} from '../types';
import { MOCK_ADDONS } from '../data/mockData';
import { useBakery } from '../context/BakeryContext';

interface CustomizationModalProps {
  cake: Cake | null;
  onClose: () => void;
  onAddToCartComplete: () => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  cake,
  onClose,
  onAddToCartComplete,
}) => {
  const { addToCart } = useBakery();

  if (!cake) return null;

  // Selected State
  const [selectedWeightKg, setSelectedWeightKg] = useState<number>(cake.defaultWeightKg || 1.0);
  const [selectedFlavorId, setSelectedFlavorId] = useState<string>(cake.defaultFlavorId || cake.availableFlavors[0]?.id || 'belgian-dark-choc');
  const [selectedEggPref, setSelectedEggPref] = useState<EggPreference>(cake.isEggDefault ? 'eggless' : 'eggless');
  const [selectedShape, setSelectedShape] = useState<CakeShape>(cake.availableShapes[0] || 'round');
  const [selectedFrosting, setSelectedFrosting] = useState<FrostingType>('whipped-cream');
  const [selectedSweetness, setSelectedSweetness] = useState<SweetnessLevel>('normal');
  const [cakeMessage, setCakeMessage] = useState<string>('Happy Birthday!');
  const [selectedColor, setSelectedColor] = useState<string>(cake.color || 'Pastel Cream & Gold');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [uploadedReferenceImages, setUploadedReferenceImages] = useState<string[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  // Selected Weight Object
  const currentWeightObj = useMemo(() => {
    return (
      cake.availableWeights.find((w) => w.weightKg === selectedWeightKg) ||
      cake.availableWeights[0]
    );
  }, [cake, selectedWeightKg]);

  // Selected Flavor Object
  const currentFlavorObj = useMemo(() => {
    return (
      cake.availableFlavors.find((f) => f.id === selectedFlavorId) ||
      cake.availableFlavors[0]
    );
  }, [cake, selectedFlavorId]);

  // Calculation of Dynamic Live Price
  const priceBreakdown = useMemo(() => {
    // Base unit calculation:
    // starting price is for 0.5kg
    const weightMultiplier = currentWeightObj?.priceMultiplier || 1;
    const baseWeightPrice = Math.round(cake.startingPrice * weightMultiplier);

    // Extra flavor charge (scaled slightly with weight)
    const flavorExtra = Math.round((currentFlavorObj?.extraPrice || 0) * (selectedWeightKg / 0.5));

    // Shape customization fee (heart / custom shape takes extra carving effort)
    const shapeFee = selectedShape === 'heart' ? 100 : selectedShape === 'custom' ? 200 : 0;

    // Frosting premium
    const frostingFee =
      selectedFrosting === 'fondant'
        ? 350
        : selectedFrosting === 'chocolate-ganache'
        ? 100
        : selectedFrosting === 'cream-cheese'
        ? 150
        : 0;

    const customizationSubtotal = flavorExtra + shapeFee + frostingFee;

    // Addons cost
    const addonsCost = selectedAddonIds.reduce((sum, addonId) => {
      const addon = MOCK_ADDONS.find((a) => a.id === addonId);
      return sum + (addon ? addon.price : 0);
    }, 0);

    const unitPrice = baseWeightPrice + customizationSubtotal + addonsCost;
    const totalPrice = unitPrice * quantity;

    return {
      baseWeightPrice,
      flavorExtra,
      shapeFee,
      frostingFee,
      customizationSubtotal,
      addonsCost,
      unitPrice,
      totalPrice,
    };
  }, [
    cake,
    currentWeightObj,
    currentFlavorObj,
    selectedWeightKg,
    selectedShape,
    selectedFrosting,
    selectedAddonIds,
    quantity,
  ]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setUploadedReferenceImages((prev) => [...prev, loadEvt.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReferenceImage = (index: number) => {
    setUploadedReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleAddToCart = () => {
    const customizationData: CakeCustomization = {
      cakeId: cake.id,
      cakeName: cake.name,
      cakeImage: cake.images[0],
      flavorId: currentFlavorObj?.id || 'standard',
      flavorName: currentFlavorObj?.name || 'Standard Flavor',
      weightKg: selectedWeightKg,
      servingEstimate: currentWeightObj?.servingEstimate || '4-6 people',
      eggPreference: selectedEggPref,
      shape: selectedShape,
      frosting: selectedFrosting,
      sweetness: selectedSweetness,
      cakeMessage: cakeMessage.trim(),
      colorPalette: selectedColor,
      referenceImages: uploadedReferenceImages,
      selectedAddonIds,
      specialInstructions: specialInstructions.trim(),
      basePrice: priceBreakdown.baseWeightPrice,
      customizationCost: priceBreakdown.customizationSubtotal,
      addonsCost: priceBreakdown.addonsCost,
      unitPrice: priceBreakdown.unitPrice,
    };

    addToCart(cake, customizationData, quantity);
    onClose();
    onAddToCartComplete();
  };

  const colorThemes = [
    'Dark Chocolate & Gold',
    'Blush Pink & Rose',
    'Pastel Lavender & Sage',
    'Ivory & Pearl White',
    'Ocean Blues & Silver',
    'Warm Caramel & Honey',
    'Ruby Red & Crimson',
    'Custom Palette (Notes)',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        id="customization-drawer"
        className="w-full max-w-3xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#EBE3D7] overflow-hidden my-auto flex flex-col max-h-[94vh]"
      >
        {/* Sticky Header */}
        <div className="px-5 py-4 bg-white border-b border-[#E8DFD3] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs border border-[#E5DACB] shrink-0">
              <img src={cake.images[0]} alt={cake.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#B83A4B]">
                  Live Customizer
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-semibold text-emerald-700">100% Freshly Baked</span>
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#231815] leading-tight line-clamp-1">
                {cake.name}
              </h2>
            </div>
          </div>

          <button
            id="close-customization-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EFE8DA] text-[#6E5D57] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Customization Controls */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-7 flex-1">
          
          {/* 1. Weight & Serving Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-[#2D2421] uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Select Cake Weight & Servings</span>
              </label>
              <span className="text-xs text-[#B83A4B] font-semibold">
                Serving: {currentWeightObj?.servingEstimate}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {cake.availableWeights.map((w) => {
                const isSelected = selectedWeightKg === w.weightKg;
                return (
                  <button
                    key={w.weightKg}
                    id={`weight-option-${w.weightKg}`}
                    type="button"
                    onClick={() => setSelectedWeightKg(w.weightKg)}
                    className={`p-3 rounded-2xl text-left transition-all border ${
                      isSelected
                        ? 'bg-[#3E2419] text-white border-[#3E2419] shadow-md scale-101'
                        : 'bg-white text-[#3E2419] border-[#E0D5C7] hover:border-[#B83A4B]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-base">{w.weightKg} kg</span>
                      {isSelected && <Check className="w-4 h-4 text-[#F7DDD4]" />}
                    </div>
                    <p
                      className={`text-[11px] mt-1 font-medium ${
                        isSelected ? 'text-[#EFE8DA]/80' : 'text-[#7A6963]'
                      }`}
                    >
                      {w.servingEstimate}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Flavor Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-[#2D2421] uppercase tracking-wider">
                2. Choose Gourmet Flavor
              </label>
              <span className="text-[11px] text-[#8C7A74]">Baked with pure dairy ingredients</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cake.availableFlavors.map((flavor) => {
                const isSelected = selectedFlavorId === flavor.id;
                return (
                  <button
                    key={flavor.id}
                    id={`flavor-option-${flavor.id}`}
                    type="button"
                    onClick={() => setSelectedFlavorId(flavor.id)}
                    className={`p-3 rounded-2xl text-left transition-all border flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#FAF2EB] text-[#2B1810] border-[#B83A4B] ring-1 ring-[#B83A4B] shadow-xs'
                        : 'bg-white text-[#4A3D38] border-[#E0D5C7] hover:border-[#B83A4B]/30'
                    }`}
                  >
                    <div>
                      <span className="text-xs sm:text-sm font-bold block">{flavor.name}</span>
                      {flavor.tagline && (
                        <span className="text-[11px] text-[#7A6963] line-clamp-1 mt-0.5">
                          {flavor.tagline}
                        </span>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {flavor.extraPrice > 0 ? (
                        <span className="text-xs font-semibold text-[#B83A4B]">+₹{flavor.extraPrice}</span>
                      ) : (
                        <span className="text-[11px] font-medium text-emerald-700">Included</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Egg Preference & Shape */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Egg Preference */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-[#2D2421] uppercase tracking-wider">
                3. Egg Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="pref-eggless-btn"
                  type="button"
                  onClick={() => setSelectedEggPref('eggless')}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    selectedEggPref === 'eggless'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                      : 'bg-white border-[#E0D5C7] text-gray-700'
                  }`}
                >
                  <div className="w-5 h-5 rounded-md border-2 border-emerald-600 flex items-center justify-center p-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">100% Eggless</span>
                    <span className="text-[10px] text-emerald-700">Pure Veg</span>
                  </div>
                </button>

                <button
                  id="pref-egg-btn"
                  type="button"
                  onClick={() => setSelectedEggPref('with-egg')}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    selectedEggPref === 'with-egg'
                      ? 'bg-[#FAF2EB] border-[#B83A4B] text-[#3E2419] ring-1 ring-[#B83A4B]'
                      : 'bg-white border-[#E0D5C7] text-gray-700'
                  }`}
                >
                  <div className="w-5 h-5 rounded-md border-2 border-amber-600 flex items-center justify-center p-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">With Egg</span>
                    <span className="text-[10px] text-gray-500">Classic Sponge</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Shape */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-[#2D2421] uppercase tracking-wider">
                4. Cake Silhouette / Shape
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'round' as CakeShape, label: 'Round', icon: Circle },
                  { id: 'heart' as CakeShape, label: 'Heart (+₹100)', icon: Heart },
                  { id: 'square' as CakeShape, label: 'Square', icon: Square },
                ].map((s) => {
                  const Icon = s.icon;
                  const isSelected = selectedShape === s.id;
                  return (
                    <button
                      key={s.id}
                      id={`shape-${s.id}`}
                      type="button"
                      onClick={() => setSelectedShape(s.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-[#3E2419] text-white border-[#3E2419]'
                          : 'bg-white border-[#E0D5C7] text-[#4A3D38] hover:bg-[#FAF5F0]'
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-[11px] font-bold block">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 4. Frosting & Sweetness */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D2421] uppercase tracking-wider">
                5. Frosting Choice
              </label>
              <select
                id="select-frosting"
                value={selectedFrosting}
                onChange={(e) => setSelectedFrosting(e.target.value as FrostingType)}
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-white border border-[#DDD2C4] text-[#2D2421] font-medium focus:outline-none focus:border-[#B83A4B]"
              >
                <option value="whipped-cream">Fresh Whipped Cream (Light & Airy)</option>
                <option value="chocolate-ganache">54% Callebaut Dark Ganache (+₹100)</option>
                <option value="buttercream">Silky Swiss Meringue Buttercream</option>
                <option value="cream-cheese">Philadelphia Cream Cheese (+₹150)</option>
                <option value="fondant">Smooth Artisan Rolled Fondant (+₹350)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D2421] uppercase tracking-wider">
                6. Sweetness Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'less-sweet' as SweetnessLevel, label: 'Less Sweet' },
                  { id: 'normal' as SweetnessLevel, label: 'Standard' },
                  { id: 'extra-sweet' as SweetnessLevel, label: 'Sweet' },
                ].map((sw) => (
                  <button
                    key={sw.id}
                    id={`sweetness-${sw.id}`}
                    type="button"
                    onClick={() => setSelectedSweetness(sw.id)}
                    className={`py-2 px-1 text-center text-xs font-semibold rounded-xl border transition-all ${
                      selectedSweetness === sw.id
                        ? 'bg-[#B83A4B] text-white border-[#B83A4B]'
                        : 'bg-white text-gray-700 border-[#DDD2C4]'
                    }`}
                  >
                    {sw.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Cake Message Live Badge */}
          <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#E5DACB] shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-[#2D2421] uppercase tracking-wider flex items-center gap-1.5">
                <span>7. Message on Cake (Piped in Cream)</span>
              </label>
              <span className="text-[11px] text-[#8C7A74]">{cakeMessage.length}/35 characters</span>
            </div>

            <input
              id="customizer-cake-message-input"
              type="text"
              maxLength={35}
              value={cakeMessage}
              onChange={(e) => setCakeMessage(e.target.value)}
              placeholder="e.g. Happy 25th Anniversary Riya & Kabir"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#DDD2C4] text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#B83A4B]/40 focus:border-[#B83A4B]"
            />

            {/* Live Visual Plaque Preview */}
            <div className="pt-2 flex items-center justify-center">
              <div className="px-5 py-2 rounded-full bg-[#FAF3EB] border-2 border-dashed border-[#C59A3F] shadow-xs text-center">
                <span className="text-[10px] uppercase tracking-widest text-[#8C7A74] block">
                  Live Plaque Preview
                </span>
                <span className="font-serif italic text-sm font-bold text-[#3E2419]">
                  "{cakeMessage || 'No Message'}"
                </span>
              </div>
            </div>
          </div>

          {/* 6. Color Palette Selection */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-[#2D2421] uppercase tracking-wider">
              8. Preferred Color Palette
            </label>
            <div className="flex flex-wrap gap-2">
              {colorThemes.map((c) => (
                <button
                  key={c}
                  id={`color-theme-${c.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                    selectedColor === c
                      ? 'bg-[#3E2419] text-white border-[#3E2419]'
                      : 'bg-white text-[#4A3D38] border-[#DDD2C4] hover:bg-[#FAF5F0]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Reference Photo Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-[#2D2421] uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#B83A4B]" />
                <span>9. Have a design in mind? Upload Reference Photo</span>
              </label>
              <span className="text-[11px] text-[#8C7A74]">Optional</span>
            </div>

            <div className="border-2 border-dashed border-[#DDD2C4] hover:border-[#B83A4B] rounded-2xl p-4 text-center transition-colors bg-white/70">
              <input
                id="ref-photo-file-input"
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label
                htmlFor="ref-photo-file-input"
                className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
              >
                <div className="w-10 h-10 rounded-full bg-[#FAF0EC] text-[#B83A4B] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-[#3E2419]">
                  Click to upload inspiration photos (JPG, PNG, WEBP)
                </p>
                <p className="text-[10px] text-[#8C7A74]">
                  Chef Aarti will review your photo during preparation
                </p>
              </label>

              {/* Uploaded image previews */}
              {uploadedReferenceImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 justify-center">
                  {uploadedReferenceImages.map((dataUrl, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden shadow-xs border">
                      <img src={dataUrl} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeReferenceImage(idx)}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 8. Paid Add-ons */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-[#2D2421] uppercase tracking-wider">
              10. Celebration Add-ons & Toppers
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MOCK_ADDONS.map((addon) => {
                const isSelected = selectedAddonIds.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    id={`addon-card-${addon.id}`}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#FAF3EB] border-[#B83A4B] ring-1 ring-[#B83A4B]'
                        : 'bg-white border-[#E0D5C7] hover:border-[#B83A4B]/30'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs shrink-0">
                      <img src={addon.image} alt={addon.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-[#2D2421] block truncate">{addon.name}</span>
                      <span className="text-xs font-bold text-[#B83A4B]">+₹{addon.price}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-[#B83A4B] border-[#B83A4B] text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 9. Special Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-[#2D2421] uppercase tracking-wider">
              11. Special Baker Instructions
            </label>
            <textarea
              id="customizer-special-instructions"
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Please keep sweetness mild, write name in gold cream, avoid nuts."
              className="w-full p-3 text-xs rounded-xl bg-white border border-[#DDD2C4] text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#B83A4B]/40 focus:border-[#B83A4B]"
            />
          </div>

        </div>

        {/* Sticky Bottom Bar with Dynamic Live Pricing */}
        <div className="p-4 bg-white border-t border-[#E8DFD3] sticky bottom-0 z-20 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Price breakdown summary */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#8C7A74] uppercase tracking-wider">Calculated Total</span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Transparent Pricing
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-serif font-bold text-2xl sm:text-3xl text-[#231815]">
                  ₹{priceBreakdown.totalPrice.toLocaleString()}
                </span>
                <span className="text-xs text-[#7A6963]">
                  (₹{priceBreakdown.unitPrice.toLocaleString()} × {quantity})
                </span>
              </div>

              {/* Breakdown text */}
              <div className="text-[11px] text-[#8C7A74] flex items-center gap-1.5 mt-0.5">
                <span>Base: ₹{priceBreakdown.baseWeightPrice}</span>
                {priceBreakdown.customizationSubtotal > 0 && (
                  <span>+ Custom: ₹{priceBreakdown.customizationSubtotal}</span>
                )}
                {priceBreakdown.addonsCost > 0 && (
                  <span>+ Add-ons: ₹{priceBreakdown.addonsCost}</span>
                )}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center border border-[#DDD2C4] rounded-xl bg-white px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:text-[#B83A4B]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-[#231815]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:text-[#B83A4B]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                id="add-customized-cake-to-cart-btn"
                type="button"
                onClick={handleAddToCart}
                className="flex-1 sm:flex-none px-7 py-3.5 rounded-xl bg-[#B83A4B] hover:bg-[#A23040] text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirm & Add to Celebration Cart</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
