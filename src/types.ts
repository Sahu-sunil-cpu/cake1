export type EggPreference = 'eggless' | 'with-egg';
export type CakeShape = 'round' | 'heart' | 'square' | 'rectangle' | 'custom';
export type FrostingType = 'whipped-cream' | 'buttercream' | 'chocolate-ganache' | 'fondant' | 'cream-cheese';
export type SweetnessLevel = 'less-sweet' | 'normal' | 'extra-sweet';
export type FulfillmentType = 'pickup' | 'delivery';
export type PaymentType = 'full' | 'advance';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod' | 'pay_later';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'prep_scheduled'
  | 'baking'
  | 'decorating'
  | 'quality_check'
  | 'ready'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface CakeWeightOption {
  weightKg: number;
  label: string;
  servingEstimate: string;
  priceMultiplier: number;
}

export interface CakeFlavorOption {
  id: string;
  name: string;
  tagline?: string;
  extraPrice: number;
}

export interface Cake {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  startingPrice: number;
  category: string;
  occasions: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  isEgglessAvailable: boolean;
  isEggDefault: boolean;
  isBestseller?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  minLeadTimeHours: number;
  availableFlavors: CakeFlavorOption[];
  availableWeights: CakeWeightOption[];
  availableShapes: CakeShape[];
  ingredients: string[];
  allergens: string[];
  defaultFlavorId: string;
  defaultWeightKg: number;
  theme?: string;
  color?: string;
}

export interface CakeAddon {
  id: string;
  name: string;
  category: 'toppers' | 'candles' | 'sweets' | 'packaging' | 'flowers';
  price: number;
  image: string;
  description?: string;
}

export interface CakeCustomization {
  cakeId: string;
  cakeName: string;
  cakeImage: string;
  flavorId: string;
  flavorName: string;
  weightKg: number;
  servingEstimate: string;
  eggPreference: EggPreference;
  shape: CakeShape;
  frosting: FrostingType;
  sweetness: SweetnessLevel;
  cakeMessage: string;
  colorPalette: string;
  referenceImages: string[];
  selectedAddonIds: string[];
  specialInstructions: string;
  basePrice: number;
  customizationCost: number;
  addonsCost: number;
  unitPrice: number;
}

export interface CartItem {
  id: string;
  cakeId: string;
  customization: CakeCustomization;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  houseFlat: string;
  street: string;
  locality: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  type: 'home' | 'office' | 'other';
}

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  type: 'pickup' | 'delivery' | 'both';
  isAvailable: boolean;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  items: CartItem[];
  fulfillmentType: FulfillmentType;
  deliveryAddress?: DeliveryAddress;
  pickupLocation?: {
    name: string;
    address: string;
    landmark: string;
    contactNumber: string;
    directionsUrl: string;
  };
  celebrationDate: string;
  timeSlot: string;
  pricing: {
    subtotal: number;
    addonsTotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    advancePaid: number;
    balanceRemaining: number;
  };
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  paymentStatus: 'paid' | 'advance_paid' | 'pending';
  orderStatus: OrderStatus;
  timeline: OrderTimelineEvent[];
  specialNotes?: string;
  couponApplied?: string;
}

export interface CustomCakeRequest {
  id: string;
  requestNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  occasion: string;
  cakeType: string;
  flavor: string;
  weight: string;
  guestsCount: number;
  eggPreference: EggPreference;
  shape: string;
  theme: string;
  preferredColors: string;
  message: string;
  requiredDate: string;
  preferredTime: string;
  budget: string;
  description: string;
  referenceImages: string[];
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  specialInstructions: string;
  status:
    | 'submitted'
    | 'under_review'
    | 'quote_sent'
    | 'quote_accepted'
    | 'quote_rejected'
    | 'advance_pending'
    | 'order_confirmed'
    | 'baking'
    | 'ready'
    | 'completed';
  quotedPrice?: number;
  advanceRequired?: number;
  bakerNotes?: string;
}

export interface Review {
  id: string;
  cakeId?: string;
  cakeName?: string;
  customerName: string;
  customerCity: string;
  rating: number;
  comment: string;
  date: string;
  photoUrl?: string;
  verifiedPurchase: boolean;
  ratingsBreakdown: {
    taste: number;
    design: number;
    freshness: number;
    packaging: number;
  };
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'flat';
  value: number;
  minOrder: number;
  maxDiscount: number;
  description: string;
}

export interface BakerySettings {
  bakeryName: string;
  tagline: string;
  bakerName: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  pickupLocation: {
    name: string;
    address: string;
    landmark: string;
    city: string;
    pincode: string;
    contactNumber: string;
    mapUrl: string;
    instructions: string;
  };
  deliveryRules: {
    serviceablePincodes: string[];
    baseDeliveryFee: number;
    freeDeliveryThreshold: number;
    maxDeliveryRadiusKm: number;
  };
  advancePaymentPercentage: number;
  minAdvanceAmount: number;
  maxCakesPerDay: number;
  isAcceptingOrders: boolean;
  minLeadTimeHours?: number;
  leadTimeHours: {
    standard: number;
    designer: number;
    premium: number;
  };
  stats: {
    cakesMade: number;
    happyCustomers: number;
    averageRating: number;
  };
}
