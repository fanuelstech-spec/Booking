import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Lock, 
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, PaymentMethod, BamendaZone, Order } from '../types';
import { BAMENDA_ZONES } from '../data/bamendaData';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'cart' | 'checkout' | 'momo_ussd_simulator' | 'order_success'>('cart');
  
  // Checkout Form States
  const [selectedZone, setSelectedZone] = useState<BamendaZone>(BAMENDA_ZONES[2]); // Default Mile 3 Nkwen
  const [streetAddress, setStreetAddress] = useState('Hospital Roundabout Bypass, Che Villa');
  const [landmark, setLandmark] = useState('Opposite Amour Mezam Agency');
  const [customerName, setCustomerName] = useState('Che Foncha');
  const [customerPhone, setCustomerPhone] = useState('+237 677 42 19 80');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  
  // USSD Simulator State
  const [ussdTimer, setUssdTimer] = useState<number>(5);
  const [ussdApproved, setUssdApproved] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Totals calculation
  const subtotalFCFA = cartItems.reduce(
    (acc, item) => acc + item.menuItem.priceFCFA * item.quantity,
    0
  );
  const deliveryFeeFCFA = selectedZone.deliveryFeeFCFA;
  const totalFCFA = subtotalFCFA + deliveryFeeFCFA;

  // Handle order submission
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (paymentMethod === 'mtn_momo' || paymentMethod === 'orange_money') {
      // Show realistic USSD Push Prompt simulation
      setStep('momo_ussd_simulator');
      setUssdApproved(false);
      setUssdTimer(4);

      // Countdown simulation
      const interval = setInterval(() => {
        setUssdTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setUssdApproved(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Cash on delivery or Express Union
      finalizeOrder();
    }
  };

  const finalizeOrder = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        restaurantId: cartItems[0]?.restaurantId || 'achu-queen-palace',
        restaurantName: cartItems[0]?.restaurantName || 'Achu Queen Palace',
        items: cartItems,
        subtotalFCFA,
        deliveryFeeFCFA,
        totalFCFA,
        customerName,
        customerPhone,
        deliveryAddress: {
          neighborhood: selectedZone.label,
          street: streetAddress,
          landmark,
          lat: selectedZone.lat,
          lng: selectedZone.lng
        },
        paymentMethod
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.data) {
        setCreatedOrder(data.data);
        onOrderCreated(data.data);
        onClearCart();
        setStep('order_success');
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      // Offline fallback
      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      const fallbackOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `BDA-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        restaurantId: cartItems[0]?.restaurantId || 'achu-queen-palace',
        restaurantName: cartItems[0]?.restaurantName || 'Achu Queen Palace',
        restaurantAddress: 'Commercial Avenue, Bamenda',
        items: cartItems,
        subtotalFCFA,
        deliveryFeeFCFA,
        totalFCFA,
        status: 'in_transit',
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: `${selectedZone.estimatedMins} mins`,
        customerName,
        customerPhone,
        deliveryAddress: {
          neighborhood: selectedZone.label,
          street: streetAddress,
          landmark,
          lat: selectedZone.lat,
          lng: selectedZone.lng
        },
        payment: {
          method: paymentMethod,
          status: 'approved',
          phoneNumber: customerPhone,
          transactionRef: `MOMO-BDA-${Math.floor(100000 + Math.random() * 900000)}`,
          paidAt: new Date().toISOString()
        },
        securityHandoverPin: pin,
        driver: {
          id: 'rider-tatah',
          name: 'Tatah Emmanuel',
          phone: '+237 677 31 09 82',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          motoModel: 'Bajaj Boxer 150 (Yellow-Green Courier)',
          plateNumber: 'NW 4821-BA',
          rating: 4.95,
          totalTrips: 480,
          currentLat: selectedZone.lat - 0.006,
          currentLng: selectedZone.lng - 0.006,
          speedKmH: 34,
          batteryPercent: 88,
          headingDeg: 45,
          currentStreetName: 'Ascending via Commercial Avenue towards Mile 2',
          helmetVerified: true,
          status: 'in_transit'
        },
        telemetryHistory: [
          {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            lat: selectedZone.lat - 0.008,
            lng: selectedZone.lng - 0.008,
            speedKmH: 30,
            event: 'Order Dispatched with Insulated Thermal Food Bag'
          }
        ]
      };
      setCreatedOrder(fallbackOrder);
      onOrderCreated(fallbackOrder);
      onClearCart();
      setStep('order_success');
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="cart-checkout-modal"
        className="relative w-full max-w-xl bg-neutral-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[92vh] text-white animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-md text-white p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
              🛒
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {step === 'cart' && 'Your Bamenda Feast Basket'}
                {step === 'checkout' && 'Checkout & Bamenda Delivery'}
                {step === 'momo_ussd_simulator' && 'Mobile Money Authorization'}
                {step === 'order_success' && 'Order Confirmed & Driver Dispatched'}
              </h3>
              <p className="text-xs text-white/60">
                {cartItems.length} items • Authentic North-West Cuisine
              </p>
            </div>
          </div>
          <button
            id="btn-close-cart"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* STEP 1: CART VIEW */}
          {step === 'cart' && (
            <div>
              {cartItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 text-orange-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                    🍲
                  </div>
                  <h4 className="font-bold text-white text-base">Your Basket is Empty</h4>
                  <p className="text-xs text-white/60 max-w-xs mx-auto">
                    Explore restaurants in Commercial Avenue, Nkwen, or Up Station and add your favorite dishes!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-white/10">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                        <img 
                          src={item.menuItem.image} 
                          alt={item.menuItem.name}
                          className="w-16 h-16 rounded-xl object-cover bg-neutral-800 flex-shrink-0 border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                            {item.menuItem.name}
                          </h4>
                          <span className="text-[11px] text-orange-400 font-medium block">
                            {item.restaurantName}
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-white/60">
                            <span className="bg-white/10 px-1.5 py-0.5 rounded capitalize text-white/80">
                              {item.customization.spiceLevel.replace('_', ' ')}
                            </span>
                            {item.customization.selectedSide && (
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                                {item.customization.selectedSide}
                              </span>
                            )}
                          </div>
                          {item.customization.specialInstructions && (
                            <p className="text-[10px] text-white/50 italic mt-0.5">
                              "{item.customization.specialInstructions}"
                            </p>
                          )}
                        </div>

                        <div className="text-right flex flex-col items-end justify-between self-stretch">
                          <span className="font-mono font-bold text-xs text-white">
                            {(item.menuItem.priceFCFA * item.quantity).toLocaleString()} FCFA
                          </span>
                          
                          <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-lg p-0.5 mt-2">
                            <button
                              onClick={() => {
                                if (item.quantity <= 1) {
                                  onRemoveItem(item.id);
                                } else {
                                  onUpdateQuantity(item.id, item.quantity - 1);
                                }
                              }}
                              className="w-5 h-5 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center font-bold text-xs text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Calculation Summary */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs space-y-1.5 backdrop-blur-md">
                    <div className="flex justify-between text-white/70">
                      <span>Subtotal Food</span>
                      <span className="font-mono text-white">{subtotalFCFA.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Estimated Bamenda Courier</span>
                      <span className="font-mono text-white">~ {deliveryFeeFCFA.toLocaleString()} FCFA</span>
                    </div>
                    <div className="border-t border-white/10 pt-1.5 flex justify-between font-bold text-white text-sm">
                      <span>Estimated Total</span>
                      <span className="font-mono text-orange-400">{totalFCFA.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <button
                    id="btn-proceed-checkout"
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Delivery & Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CHECKOUT & LOCAL PAYMENT */}
          {step === 'checkout' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              
              {/* Delivery Zone Selection */}
              <div>
                <label className="block text-xs font-bold uppercase text-white/80 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" /> Select Bamenda Neighborhood *
                </label>
                <select
                  value={selectedZone.name}
                  onChange={(e) => {
                    const found = BAMENDA_ZONES.find(z => z.name === e.target.value);
                    if (found) setSelectedZone(found);
                  }}
                  className="w-full bg-neutral-800 border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  {BAMENDA_ZONES.map(zone => (
                    <option key={zone.name} value={zone.name} className="bg-neutral-800 text-white">
                      {zone.label} (+{zone.deliveryFeeFCFA} FCFA, ~{zone.estimatedMins} mins)
                    </option>
                  ))}
                </select>
              </div>

              {/* Street & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    Street / Quarter Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mile 3 Hospital Bypass, Fon Street"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/15 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    Famous Nearest Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Amour Mezam Agency / Total station"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/15 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Che Foncha / Grace"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/15 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone (+237 Cameroon) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 67X XXX XXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/15 text-white placeholder:text-white/40 rounded-xl font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Local Payment Methods */}
              <div>
                <label className="block text-xs font-bold uppercase text-white/80 mb-2 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-orange-400" /> Local Payment Method in Bamenda
                </label>
                <div className="grid grid-cols-2 gap-2">
                  
                  {/* MTN MoMo */}
                  <div
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'mtn_momo'
                        ? 'border-yellow-500 bg-yellow-500/20 ring-1 ring-yellow-500/40 text-white'
                        : 'border-white/10 hover:border-white/20 bg-white/5 text-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-yellow-300 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"></span>
                        MTN MoMo
                      </span>
                      {paymentMethod === 'mtn_momo' && <span className="text-yellow-400 text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-[10px] text-white/50 block">Instant *126# push prompt</span>
                  </div>

                  {/* Orange Money */}
                  <div
                    onClick={() => setPaymentMethod('orange_money')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'orange_money'
                        ? 'border-orange-500 bg-orange-500/20 ring-1 ring-orange-500/40 text-white'
                        : 'border-white/10 hover:border-white/20 bg-white/5 text-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-orange-300 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
                        Orange Money
                      </span>
                      {paymentMethod === 'orange_money' && <span className="text-orange-400 text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-[10px] text-white/50 block">Instant #150# prompt</span>
                  </div>

                  {/* Express Union */}
                  <div
                    onClick={() => setPaymentMethod('express_union')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'express_union'
                        ? 'border-blue-500 bg-blue-500/20 ring-1 ring-blue-500/40 text-white'
                        : 'border-white/10 hover:border-white/20 bg-white/5 text-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-blue-300 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                        EU Mobile
                      </span>
                      {paymentMethod === 'express_union' && <span className="text-blue-400 text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-[10px] text-white/50 block">Express Union Mobile</span>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-emerald-500 bg-emerald-500/20 ring-1 ring-emerald-500/40 text-white'
                        : 'border-white/10 hover:border-white/20 bg-white/5 text-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                        Cash on Delivery
                      </span>
                      {paymentMethod === 'cash_on_delivery' && <span className="text-emerald-400 text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-[10px] text-white/50 block">Pay XAF notes on arrival</span>
                  </div>
                </div>
              </div>

              {/* Security Handover Notice */}
              <div className="bg-white/5 border border-orange-500/30 p-3 rounded-xl flex items-start gap-2 text-xs backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-[11px] leading-relaxed">
                  <strong className="text-orange-300">Secure Delivery Guarantee:</strong> You will receive a unique 4-digit Security Handover PIN. Never share this code until the driver physically presents your hot meal at your gate!
                </p>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs space-y-1 backdrop-blur-md">
                <div className="flex justify-between text-white/70">
                  <span>Food Subtotal</span>
                  <span className="font-mono text-white">{subtotalFCFA.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Delivery to {selectedZone.label.split('(')[0]}</span>
                  <span className="font-mono text-white">{deliveryFeeFCFA.toLocaleString()} FCFA</span>
                </div>
                <div className="border-t border-white/10 pt-1 flex justify-between font-bold text-white text-sm">
                  <span>Total Due</span>
                  <span className="font-mono text-orange-400">{totalFCFA.toLocaleString()} FCFA</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-3 py-2 text-xs font-semibold text-white/60 hover:text-white"
                >
                  ← Back to Cart
                </button>

                <button
                  id="btn-confirm-order-pay"
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 flex items-center gap-2"
                >
                  <span>Confirm & Authorize Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: USSD PUSH SIMULATOR (MoMo / Orange) */}
          {step === 'momo_ussd_simulator' && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400 mx-auto flex items-center justify-center animate-pulse shadow-lg">
                <Smartphone className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-bold text-base text-white">
                  {paymentMethod === 'mtn_momo' ? 'MTN Mobile Money Cameroon' : 'Orange Money Cameroun'}
                </h4>
                <p className="text-xs text-white/70 mt-1 max-w-sm mx-auto">
                  Payment push request of <strong className="text-white">{totalFCFA.toLocaleString()} FCFA</strong> sent to <strong className="font-mono text-orange-300">{customerPhone}</strong>.
                </p>
              </div>

              {/* Simulated Handset Screen */}
              <div className="bg-black/60 backdrop-blur-xl text-white p-4 rounded-2xl max-w-xs mx-auto border border-white/20 shadow-2xl font-mono text-left">
                <div className="flex justify-between items-center text-[10px] text-white/50 border-b border-white/10 pb-1 mb-2">
                  <span>MTN-Cameroon 4G</span>
                  <span>100% 🔋</span>
                </div>
                <div className="text-xs text-orange-400 font-bold mb-1">
                  USSD PROMPT: *126#
                </div>
                <p className="text-[11px] text-white/80 leading-snug mb-3">
                  Approve payment of {totalFCFA} FCFA to BAMENDA DINE SERVICES? Enter your MoMo PIN:
                </p>
                <div className="bg-white/10 border border-white/10 p-2 rounded-lg text-center text-sm tracking-widest text-emerald-400 font-bold">
                  ••••
                </div>
                <div className="text-[10px] text-white/50 text-center mt-2">
                  {ussdApproved ? (
                    <span className="text-emerald-400 font-bold">✓ TRANSACTION APPROVED BY MTN</span>
                  ) : (
                    <span>Auto-approving in {ussdTimer}s...</span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-complete-ussd"
                  type="button"
                  disabled={!ussdApproved && ussdTimer > 0}
                  onClick={finalizeOrder}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50"
                >
                  {ussdApproved ? 'Transaction Complete → View Real-time Driver' : 'Processing USSD...'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER SUCCESS & HANDOVER PIN */}
          {step === 'order_success' && createdOrder && (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-white">
                  Order Successfully Placed!
                </h4>
                <p className="text-xs text-white/70 mt-1 max-w-sm mx-auto">
                  The kitchen at <strong className="text-white">{createdOrder.restaurantName}</strong> has received your meal order.
                </p>
              </div>

              {/* CRITICAL: Secure Handover OTP Display */}
              <div className="bg-white/5 backdrop-blur-xl border border-orange-500/40 rounded-2xl p-4 max-w-md mx-auto text-left shadow-2xl">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  Your Secure Driver Handover PIN
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-white/70">
                    Provide this PIN to your delivery rider upon handover:
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl font-black text-orange-400 tracking-widest bg-black/40 px-3 py-1 rounded-xl border border-orange-500/30 shadow-sm">
                    {createdOrder.securityHandoverPin}
                  </span>
                </div>
                <p className="text-[10px] text-white/50 mt-2 italic">
                  * For your security, the delivery rider cannot complete this drop-off without verifying this 4-digit code.
                </p>
              </div>

              {/* Rider assigned preview */}
              {createdOrder.driver && (
                <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3 text-left max-w-md mx-auto">
                  <img
                    src={createdOrder.driver.avatar}
                    alt={createdOrder.driver.name}
                    className="w-11 h-11 rounded-full object-cover border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{createdOrder.driver.name}</span>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        ★ {createdOrder.driver.rating}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/60 block truncate">
                      {createdOrder.driver.motoModel} • {createdOrder.driver.plateNumber}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  id="btn-go-to-live-tracking"
                  type="button"
                  onClick={onClose}
                  className="w-full max-w-md mx-auto py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                >
                  <span>Open Live Bamenda GPS Tracking Map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
