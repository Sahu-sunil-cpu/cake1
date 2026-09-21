import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Cake,
  CakeCustomization,
  CartItem,
  DeliveryAddress,
  Order,
  OrderStatus,
  CustomCakeRequest,
  Review,
  Coupon,
  BakerySettings,
  FulfillmentType,
} from '../types';
import {
  INITIAL_BAKERY_SETTINGS,
  MOCK_CAKES,
  MOCK_COUPONS,
  MOCK_REVIEWS,
  INITIAL_SEED_ORDERS,
  INITIAL_CUSTOM_REQUESTS,
} from '../data/mockData';

interface CartTotals {
  subtotal: number;
  addonsTotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  advancePayable: number;
  balancePayable: number;
}

interface BakeryContextType {
  // Navigation & View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeCakeForCustomizer: Cake | null;
  setActiveCakeForCustomizer: (cake: Cake | null) => void;
  activeCakeForDetails: Cake | null;
  setActiveCakeForDetails: (cake: Cake | null) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;

  // Catalog
  cakes: Cake[];
  updateCake: (cake: Cake) => void;
  addCake: (cake: Cake) => void;
  deleteCake: (cakeId: string) => void;

  // Pincode & Delivery Eligibility
  checkedPincode: string;
  deliveryEligibility: 'unknown' | 'serviceable' | 'pickup_only';
  checkPincode: (pincode: string) => boolean;

  // Cart
  cart: CartItem[];
  addToCart: (cake: Cake, customization: CakeCustomization, quantity?: number) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotals: CartTotals;
  fulfillmentType: FulfillmentType;
  setFulfillmentType: (type: FulfillmentType) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (cakeId: string) => void;
  isWishlisted: (cakeId: string) => boolean;

  // Orders
  orders: Order[];
  activeTrackingOrder: Order | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  placeOrder: (orderPayload: {
    customer: { name: string; phone: string; email: string };
    fulfillmentType: FulfillmentType;
    deliveryAddress?: DeliveryAddress;
    celebrationDate: string;
    timeSlot: string;
    paymentMethod: any;
    paymentType: any;
    specialNotes?: string;
  }) => Order;
  cancelOrder: (orderId: string, reason: string) => boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;

  // Custom Quotations
  customRequests: CustomCakeRequest[];
  submitCustomRequest: (req: Omit<CustomCakeRequest, 'id' | 'requestNumber' | 'createdAt' | 'status'>) => CustomCakeRequest;
  updateCustomQuote: (requestId: string, quotedPrice: number, advanceRequired: number, bakerNotes?: string) => void;
  respondToQuote: (requestId: string, accept: boolean) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'verifiedPurchase'>) => void;

  // User Profile
  currentUser: { name: string; phone: string; email: string } | null;
  savedAddresses: DeliveryAddress[];
  saveAddress: (address: DeliveryAddress) => void;
  loginUser: (name: string, phone: string, email: string) => void;
  logoutUser: () => void;

  // Settings
  settings: BakerySettings;
  updateSettings: (newSettings: Partial<BakerySettings>) => void;

  // Modals & UI helpers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  wishlistIds: string[];
  updateOrderPaymentStatus: (orderId: string, status: 'paid' | 'advance_paid' | 'pending') => void;
  respondToCustomRequest: (requestId: string, quotedPrice: number, bakerNotes?: string) => void;
}

const BakeryContext = createContext<BakeryContextType | null>(null);

export const BakeryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeCakeForCustomizer, setActiveCakeForCustomizer] = useState<Cake | null>(null);
  const [activeCakeForDetails, setActiveCakeForDetails] = useState<Cake | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Products
  const [cakes, setCakes] = useState<Cake[]>(() => {
    const saved = localStorage.getItem('lw_cakes');
    return saved ? JSON.parse(saved) : MOCK_CAKES;
  });

  // Settings
  const [settings, setSettings] = useState<BakerySettings>(() => {
    const saved = localStorage.getItem('lw_settings');
    return saved ? JSON.parse(saved) : INITIAL_BAKERY_SETTINGS;
  });

  // Pincode check
  const [checkedPincode, setCheckedPincode] = useState<string>('560038');
  const [deliveryEligibility, setDeliveryEligibility] = useState<'unknown' | 'serviceable' | 'pickup_only'>('serviceable');

  // Fulfillment Choice
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lw_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('lw_wishlist');
    return saved ? JSON.parse(saved) : ['cake-belgian-drip', 'cake-korean-bento'];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lw_orders');
    return saved ? JSON.parse(saved) : INITIAL_SEED_ORDERS;
  });
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>('ord-1024');

  // Custom Requests
  const [customRequests, setCustomRequests] = useState<CustomCakeRequest[]>(() => {
    const saved = localStorage.getItem('lw_custom_requests');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOM_REQUESTS;
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('lw_reviews');
    return saved ? JSON.parse(saved) : MOCK_REVIEWS;
  });

  // Current User
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string; email: string } | null>(() => {
    const saved = localStorage.getItem('lw_user');
    return saved ? JSON.parse(saved) : { name: 'Ria Sengupta', phone: '+91 98765 43210', email: 'ria.sengupta@example.com' };
  });

  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>(() => {
    const saved = localStorage.getItem('lw_addresses');
    return saved
      ? JSON.parse(saved)
      : [
          {
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
          },
        ];
  });

  // Persistence to local storage
  useEffect(() => {
    localStorage.setItem('lw_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lw_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('lw_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lw_custom_requests', JSON.stringify(customRequests));
  }, [customRequests]);

  useEffect(() => {
    localStorage.setItem('lw_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('lw_cakes', JSON.stringify(cakes));
  }, [cakes]);

  useEffect(() => {
    localStorage.setItem('lw_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lw_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lw_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('lw_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  // Pincode checker function
  const checkPincode = (pincode: string) => {
    setCheckedPincode(pincode);
    const clean = pincode.trim();
    if (settings.deliveryRules.serviceablePincodes.includes(clean)) {
      setDeliveryEligibility('serviceable');
      return true;
    } else {
      setDeliveryEligibility('pickup_only');
      return false;
    }
  };

  // Cart actions
  const addToCart = (cake: Cake, customization: CakeCustomization, quantity = 1) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      cakeId: cake.id,
      customization,
      quantity,
      unitPrice: customization.unitPrice,
      totalPrice: customization.unitPrice * quantity,
    };

    setCart((prev) => [...prev, newItem]);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = Math.max(0, item.quantity + delta);
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = MOCK_COUPONS.find((c) => c.code.toUpperCase() === clean);
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try WELCOME100 or SWEET15' };
    }
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    if (subtotal < found.minOrder) {
      return { success: false, message: `Coupon requires minimum order value of ₹${found.minOrder}` };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist actions
  const toggleWishlist = (cakeId: string) => {
    setWishlist((prev) => (prev.includes(cakeId) ? prev.filter((id) => id !== cakeId) : [...prev, cakeId]));
  };

  const isWishlisted = (cakeId: string) => wishlist.includes(cakeId);

  // Cart calculations
  const cartTotals = useMemo<CartTotals>(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const addonsTotal = cart.reduce((sum, item) => {
      return sum + (item.customization.addonsCost || 0) * item.quantity;
    }, 0);

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percent') {
        discount = Math.min((subtotal * appliedCoupon.value) / 100, appliedCoupon.maxDiscount);
      } else {
        discount = Math.min(appliedCoupon.value, subtotal);
      }
    }

    let deliveryFee = 0;
    if (fulfillmentType === 'delivery') {
      deliveryFee = subtotal >= settings.deliveryRules.freeDeliveryThreshold ? 0 : settings.deliveryRules.baseDeliveryFee;
    }

    const total = Math.max(0, subtotal - discount + deliveryFee);
    const advancePayable = Math.max(
      settings.minAdvanceAmount,
      Math.round((total * settings.advancePaymentPercentage) / 100)
    );
    const balancePayable = Math.max(0, total - advancePayable);

    return {
      subtotal,
      addonsTotal,
      discount,
      deliveryFee,
      total,
      advancePayable,
      balancePayable,
    };
  }, [cart, appliedCoupon, fulfillmentType, settings]);

  // Order Placement
  const placeOrder = (orderPayload: {
    customer: { name: string; phone: string; email: string };
    fulfillmentType: FulfillmentType;
    deliveryAddress?: DeliveryAddress;
    celebrationDate: string;
    timeSlot: string;
    paymentMethod: any;
    paymentType: any;
    specialNotes?: string;
  }): Order => {
    const orderNum = `LW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = `ord-${Date.now()}`;

    const advancePaid =
      orderPayload.paymentType === 'full' ? cartTotals.total : cartTotals.advancePayable;
    const balanceRemaining =
      orderPayload.paymentType === 'full' ? 0 : cartTotals.balancePayable;

    const newOrder: Order = {
      id: newId,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      customer: orderPayload.customer,
      items: [...cart],
      fulfillmentType: orderPayload.fulfillmentType,
      deliveryAddress: orderPayload.deliveryAddress,
      pickupLocation:
        orderPayload.fulfillmentType === 'pickup'
          ? {
              name: settings.pickupLocation.name,
              address: settings.pickupLocation.address,
              landmark: settings.pickupLocation.landmark,
              contactNumber: settings.pickupLocation.contactNumber,
              directionsUrl: settings.pickupLocation.mapUrl,
            }
          : undefined,
      celebrationDate: orderPayload.celebrationDate,
      timeSlot: orderPayload.timeSlot,
      pricing: {
        subtotal: cartTotals.subtotal,
        addonsTotal: cartTotals.addonsTotal,
        deliveryFee: cartTotals.deliveryFee,
        discount: cartTotals.discount,
        total: cartTotals.total,
        advancePaid,
        balanceRemaining,
      },
      paymentMethod: orderPayload.paymentMethod,
      paymentType: orderPayload.paymentType,
      paymentStatus: orderPayload.paymentType === 'full' ? 'paid' : 'advance_paid',
      orderStatus: 'confirmed',
      timeline: [
        {
          status: 'placed',
          label: 'Order Placed',
          timestamp: 'Just now',
          note: `Payment of ₹${advancePaid} confirmed via ${orderPayload.paymentMethod.toUpperCase()}`,
        },
        {
          status: 'confirmed',
          label: 'Order Confirmed',
          timestamp: 'Just now',
          note: `Chef ${settings.bakerName} has scheduled bake for ${orderPayload.celebrationDate}`,
        },
      ],
      specialNotes: orderPayload.specialNotes,
      couponApplied: appliedCoupon?.code,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrderId(newOrder.id);
    clearCart();
    return newOrder;
  };

  const cancelOrder = (orderId: string, reason: string) => {
    let success = false;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          if (['placed', 'confirmed'].includes(ord.orderStatus)) {
            success = true;
            return {
              ...ord,
              orderStatus: 'cancelled',
              timeline: [
                ...ord.timeline,
                {
                  status: 'cancelled',
                  label: 'Order Cancelled',
                  timestamp: 'Just now',
                  note: `Reason: ${reason}. Refund initiation in progress.`,
                },
              ],
            };
          }
        }
        return ord;
      })
    );
    return success;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const statusLabels: Record<OrderStatus, string> = {
      placed: 'Order Placed',
      confirmed: 'Order Confirmed',
      prep_scheduled: 'Preparation Scheduled',
      baking: 'Baking in Kitchen',
      decorating: 'Artisan Decorating',
      quality_check: 'Quality Check & Chilled',
      ready: 'Cake Ready',
      ready_for_pickup: 'Ready for Self Pickup',
      picked_up: 'Picked Up by Customer',
      out_for_delivery: 'Out for Doorstep Delivery',
      delivered: 'Delivered to Address',
      completed: 'Celebration Completed',
      cancelled: 'Order Cancelled',
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            orderStatus: status,
            timeline: [
              ...ord.timeline,
              {
                status,
                label: statusLabels[status] || status,
                timestamp: 'Just now',
                note: note || `Updated by Chef ${settings.bakerName}`,
              },
            ],
          };
        }
        return ord;
      })
    );
  };

  // Custom Quote Request
  const submitCustomRequest = (
    req: Omit<CustomCakeRequest, 'id' | 'requestNumber' | 'createdAt' | 'status'>
  ): CustomCakeRequest => {
    const newReq: CustomCakeRequest = {
      ...req,
      id: `req-${Date.now()}`,
      requestNumber: `REQ-${Math.floor(200 + Math.random() * 800)}`,
      createdAt: 'Just now',
      status: 'submitted',
    };
    setCustomRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  const updateCustomQuote = (
    requestId: string,
    quotedPrice: number,
    advanceRequired: number,
    bakerNotes?: string
  ) => {
    setCustomRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            quotedPrice,
            advanceRequired,
            bakerNotes,
            status: 'quote_sent',
          };
        }
        return r;
      })
    );
  };

  const respondToQuote = (requestId: string, accept: boolean) => {
    setCustomRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: accept ? 'quote_accepted' : 'quote_rejected',
          };
        }
        return r;
      })
    );
  };

  const respondToCustomRequest = (requestId: string, quotedPrice: number, bakerNotes?: string) => {
    updateCustomQuote(requestId, quotedPrice, Math.round(quotedPrice * 0.4), bakerNotes);
  };

  const updateOrderPaymentStatus = (orderId: string, status: 'paid' | 'advance_paid' | 'pending') => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: status,
            pricing: {
              ...ord.pricing,
              balanceRemaining: status === 'paid' ? 0 : ord.pricing.balanceRemaining,
            },
          };
        }
        return ord;
      })
    );
  };

  // Review submission
  const addReview = (newRev: Omit<Review, 'id' | 'date' | 'verifiedPurchase'>) => {
    const revItem: Review = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      verifiedPurchase: true,
    };
    setReviews((prev) => [revItem, ...prev]);
  };

  // User Profile
  const loginUser = (name: string, phone: string, email: string) => {
    setCurrentUser({ name, phone, email });
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const saveAddress = (addr: DeliveryAddress) => {
    setSavedAddresses((prev) => [addr, ...prev]);
  };

  // Product actions
  const updateCake = (updated: Cake) => {
    setCakes((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const addCake = (cake: Cake) => {
    setCakes((prev) => [cake, ...prev]);
  };

  const deleteCake = (cakeId: string) => {
    setCakes((prev) => prev.filter((c) => c.id !== cakeId));
  };

  const updateSettings = (newSettings: Partial<BakerySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const activeTrackingOrder = useMemo(() => {
    return orders.find((o) => o.id === activeTrackingOrderId) || orders[0] || null;
  }, [orders, activeTrackingOrderId]);

  return (
    <BakeryContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeCakeForCustomizer,
        setActiveCakeForCustomizer,
        activeCakeForDetails,
        setActiveCakeForDetails,
        isAdminMode,
        setIsAdminMode,
        cakes,
        updateCake,
        addCake,
        deleteCake,
        checkedPincode,
        deliveryEligibility,
        checkPincode,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartTotals,
        fulfillmentType,
        setFulfillmentType,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        activeTrackingOrder,
        setActiveTrackingOrderId,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        customRequests,
        submitCustomRequest,
        updateCustomQuote,
        respondToQuote,
        reviews,
        addReview,
        currentUser,
        savedAddresses,
        saveAddress,
        loginUser,
        logoutUser,
        settings,
        updateSettings,
        isCartOpen,
        setIsCartOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        wishlistIds: wishlist,
        updateOrderPaymentStatus,
        respondToCustomRequest,
      }}
    >
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};
