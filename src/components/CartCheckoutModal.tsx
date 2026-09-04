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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="cart-checkout-modal"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold">
              🛒
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {step === 'cart' && 'Your Bamenda Feast Basket'}
                {step === 'checkout' && 'Checkout & Bamenda Delivery'}
                {step === 'momo_ussd_simulator' && 'Mobile Money Authorization'}
                {step === 'order_success' && 'Order Confirmed & Driver Dispatched'}
              </h3>
              <p className="text-xs text-slate-400">
                {cartItems.length} items • Authentic North-West Cuisine
              </p>
            </div>
          </div>
          <button
            id="btn-close-cart"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
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
                  <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                    🍲
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">Your Basket is Empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explore restaurants in Commercial Avenue, Nkwen, or Up Station and add your favorite dishes!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-slate-100">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                        <img 
                          src={item.menuItem.image} 
                          alt={item.menuItem.name}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {item.menuItem.name}
                          </h4>
                          <span className="text-[11px] text-amber-700 font-medium block">
                            {item.restaurantName}
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-slate-500">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded capitalize">
                              {item.customization.spiceLevel.replace('_', ' ')}
                            </span>
                            {item.customization.selectedSide && (
                              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                                {item.customization.selectedSide}
                              </span>
                            )}
                          </div>
                          {item.customization.specialInstructions && (
                            <p className="text-[10px] text-slate-400 italic mt-0.5">
                              "{item.customization.specialInstructions}"
                            </p>
                          )}
                        </div>

                        <div className="text-right flex flex-col items-end justify-between self-stretch">
                          <span className="font-mono font-bold text-xs text-slate-900">
                            {(item.menuItem.priceFCFA * item.quantity).toLocaleString()} FCFA
                          </span>
                          
                          <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5 mt-2">
                            <button
                              onClick={() => {
                                if (item.quantity <= 1) {
                                  onRemoveItem(item.id);
                                } else {
                                  onUpdateQuantity(item.id, item.quantity - 1);
                                }
                              }}
                              className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:bg-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center font-bold text-xs text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:bg-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Calculation Summary */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal Food</span>
                      <span className="font-mono">{subtotalFCFA.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Estimated Bamenda Courier</span>
                      <span className="font-mono">~ {deliveryFeeFCFA.toLocaleString()} FCFA</span>
                    </div>
                    <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900 text-sm">
                      <span>Estimated Total</span>
                      <span className="font-mono text-amber-700">{totalFCFA.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <button
                    id="btn-proceed-checkout"
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
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
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" /> Select Bamenda Neighborhood *
                </label>
                <select
                  value={selectedZone.name}
                  onChange={(e) => {
                    const found = BAMENDA_ZONES.find(z => z.name === e.target.value);
                    if (found) setSelectedZone(found);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {BAMENDA_ZONES.map(zone => (
                    <option key={zone.name} value={zone.name}>
                      {zone.label} (+{zone.deliveryFeeFCFA} FCFA, ~{zone.estimatedMins} mins)
                    </option>
                  ))}
                </select>
              </div>

              {/* Street & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street / Quarter Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mile 3 Hospital Bypass, Fon Street"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Famous Nearest Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Amour Mezam Agency / Total station"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Che Foncha / Grace"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> Phone (+237 Cameroon) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 67X XXX XXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Local Payment Methods */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-2 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-amber-600" /> Local Payment Method in Bamenda
                </label>
                <div className="grid grid-cols-2 gap-2">
                  
                  {/* MTN MoMo */}
                  <div
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'mtn_momo'
                        ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-amber-900 flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                        MTN MoMo
                      </span>
                      {paymentMethod === 'mtn_momo' && <span className="text-amber-600 text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-[10px] text-slate-500 block">Instant *126# push prompt</span>
                  </div>

                  {/* Orange Money */}
                  <div
                    onClick={() => setPaymentMethod('orange_money')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'orange_money'
                        ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-orange-900 flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
                        Orange Money
                      </span>
                      {paymentMethod === 'orange_money' && <span className="text-orange-600 text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-[10px] text-slate-500 block">Instant #150# prompt</span>
                  </div>

                  {/* Express Union */}
                  <div
                    onClick={() => setPaymentMethod('express_union')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'express_union'
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-blue-900 flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
                        EU Mobile
                      </span>
                      {paymentMethod === 'express_union' && <span className="text-blue-600 text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-[10px] text-slate-500 block">Express Union Mobile</span>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-emerald-900 flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                        Cash on Delivery
                      </span>
                      {paymentMethod === 'cash_on_delivery' && <span className="text-emerald-600 text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-[10px] text-slate-500 block">Pay XAF notes on arrival</span>
                  </div>
                </div>
              </div>

              {/* Security Handover Notice */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p className="text-amber-900 text-[11px] leading-relaxed">
                  <strong>Secure Delivery Guarantee:</strong> You will receive a unique 4-digit Security Handover PIN. Never share this code until the driver physically presents your hot meal at your gate!
                </p>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Food Subtotal</span>
                  <span className="font-mono">{subtotalFCFA.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery to {selectedZone.label.split('(')[0]}</span>
                  <span className="font-mono">{deliveryFeeFCFA.toLocaleString()} FCFA</span>
                </div>
                <div className="border-t border-slate-200 pt-1 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Due</span>
                  <span className="font-mono text-emerald-700">{totalFCFA.toLocaleString()} FCFA</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  ← Back to Cart
                </button>

                <button
                  id="btn-confirm-order-pay"
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
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
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-700 mx-auto flex items-center justify-center animate-pulse">
                <Smartphone className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-bold text-base text-slate-900">
                  {paymentMethod === 'mtn_momo' ? 'MTN Mobile Money Cameroon' : 'Orange Money Cameroun'}
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Payment push request of <strong className="text-slate-900">{totalFCFA.toLocaleString()} FCFA</strong> sent to <strong className="font-mono text-slate-900">{customerPhone}</strong>.
                </p>
              </div>

              {/* Simulated Handset Screen */}
              <div className="bg-slate-950 text-white p-4 rounded-2xl max-w-xs mx-auto border-2 border-slate-800 shadow-2xl font-mono text-left">
                <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-2">
                  <span>MTN-Cameroon 4G</span>
                  <span>100% 🔋</span>
                </div>
                <div className="text-xs text-amber-400 font-bold mb-1">
                  USSD PROMPT: *126#
                </div>
                <p className="text-[11px] text-slate-200 leading-snug mb-3">
                  Approve payment of {totalFCFA} FCFA to BAMENDA DINE SERVICES? Enter your MoMo PIN:
                </p>
                <div className="bg-slate-900 p-2 rounded text-center text-sm tracking-widest text-emerald-400 font-bold">
                  ••••
                </div>
                <div className="text-[10px] text-slate-400 text-center mt-2">
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
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-50"
                >
                  {ussdApproved ? 'Transaction Complete → View Real-time Driver' : 'Processing USSD...'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER SUCCESS & HANDOVER PIN */}
          {step === 'order_success' && createdOrder && (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 font-serif">
                  Order Successfully Placed!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  The kitchen at <strong className="text-slate-900">{createdOrder.restaurantName}</strong> has received your meal order.
                </p>
              </div>

              {/* CRITICAL: Secure Handover OTP Display */}
              <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 max-w-md mx-auto text-left shadow-md">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Your Secure Driver Handover PIN
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-600">
                    Provide this PIN to your delivery rider upon handover:
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl font-black text-amber-700 tracking-widest bg-white px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">
                    {createdOrder.securityHandoverPin}
                  </span>
                </div>
                <p className="text-[10px] text-amber-800 mt-2 italic">
                  * For your security, the delivery rider cannot complete this drop-off without verifying this 4-digit code.
                </p>
              </div>

              {/* Rider assigned preview */}
              {createdOrder.driver && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3 text-left max-w-md mx-auto">
                  <img
                    src={createdOrder.driver.avatar}
                    alt={createdOrder.driver.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{createdOrder.driver.name}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        ★ {createdOrder.driver.rating}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">
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
                  className="w-full max-w-md mx-auto py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
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
