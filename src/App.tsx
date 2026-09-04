import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RestaurantList } from './components/RestaurantList';
import { RestaurantDetail } from './components/RestaurantDetail';
import { DishCustomizerModal } from './components/DishCustomizerModal';
import { TableReservationModal } from './components/TableReservationModal';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { LiveTrackingView } from './components/LiveTrackingView';
import { DriverDispatchMonitor } from './components/DriverDispatchMonitor';
import { ReservationsList } from './components/ReservationsList';
import { AiCulinaryConcierge } from './components/AiCulinaryConcierge';

import { 
  Restaurant, 
  MenuItem, 
  CartItem, 
  CartCustomization, 
  Order, 
  TableReservation 
} from './types';
import { BAMENDA_RESTAURANTS } from './data/bamendaData';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'explore' | 'reservations' | 'tracking' | 'driver_monitor'>('explore');
  
  // Data
  const [restaurants, setRestaurants] = useState<Restaurant[]>(BAMENDA_RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  // Modals & Drawers
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [dishParentRestaurant, setDishParentRestaurant] = useState<{ id: string; name: string } | null>(null);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingTargetRestaurant, setBookingTargetRestaurant] = useState<Restaurant | null>(null);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);

  // Cart & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Initial active prototype order in transit across Bamenda
  const [activeOrders, setActiveOrders] = useState<Order[]>([
    {
      id: 'bda-ord-101',
      orderNumber: 'BDA-ORD-8392',
      restaurantId: 'achu-queen-palace',
      restaurantName: 'Achu Queen Palace',
      restaurantAddress: 'Commercial Avenue, Bamenda',
      items: [
        {
          id: 'item-init-1',
          menuItem: BAMENDA_RESTAURANTS[0].menu[0],
          quantity: 2,
          customization: {
            spiceLevel: 'medium',
            selectedSide: 'Extra Kanda (+500 FCFA)',
            specialInstructions: 'Pack yellow soup broth warmly in separate leaf wrap'
          },
          restaurantId: 'achu-queen-palace',
          restaurantName: 'Achu Queen Palace'
        },
        {
          id: 'item-init-2',
          menuItem: BAMENDA_RESTAURANTS[0].menu[3],
          quantity: 1,
          customization: {
            spiceLevel: 'mild',
            specialInstructions: 'Freshly chilled natural raffia palm wine'
          },
          restaurantId: 'achu-queen-palace',
          restaurantName: 'Achu Queen Palace'
        }
      ],
      subtotalFCFA: 8500,
      deliveryFeeFCFA: 1000,
      totalFCFA: 9500,
      status: 'in_transit',
      createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      estimatedDeliveryTime: '15 mins',
      customerName: 'Che Foncha',
      customerPhone: '+237 677 42 19 80',
      deliveryAddress: {
        neighborhood: 'Mile 3 Nkwen (Hospital Roundabout)',
        street: 'Hospital Roundabout Bypass, Che Villa',
        landmark: 'Opposite Amour Mezam Agency',
        lat: 5.9765,
        lng: 10.1780
      },
      payment: {
        method: 'mtn_momo',
        status: 'approved',
        phoneNumber: '+237 677 42 19 80',
        transactionRef: 'MOMO-BDA-928419',
        paidAt: new Date(Date.now() - 11 * 60 * 1000).toISOString()
      },
      securityHandoverPin: '7429',
      driver: {
        id: 'rider-tatah',
        name: 'Tatah Emmanuel',
        phone: '+237 677 31 09 82',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        motoModel: 'Bajaj Boxer 150 (Yellow-Green Courier)',
        plateNumber: 'NW 4821-BA',
        rating: 4.95,
        totalTrips: 480,
        currentLat: 5.9680,
        currentLng: 10.1690,
        speedKmH: 34,
        batteryPercent: 88,
        headingDeg: 45,
        currentStreetName: 'Mile 2 Nkwen Church Junction',
        helmetVerified: true,
        status: 'in_transit'
      },
      telemetryHistory: [
        { time: '14:30', lat: 5.9592, lng: 10.1585, speedKmH: 0, event: 'Order Picked Up at Achu Queen Palace (Commercial Ave)' },
        { time: '14:34', lat: 5.9628, lng: 10.1635, speedKmH: 36, event: 'Cruising via Commercial Avenue Customs Junction' },
        { time: '14:38', lat: 5.9680, lng: 10.1690, speedKmH: 34, event: 'Passing Presbyterian Church, Mile 2 Nkwen' }
      ]
    }
  ]);

  const [currentOrderForTracking, setCurrentOrderForTracking] = useState<Order | null>(activeOrders[0]);

  // Initial table reservation
  const [reservations, setReservations] = useState<TableReservation[]>([
    {
      id: 'res-init-1',
      reservationNumber: 'BDA-RES-4912',
      restaurantId: 'abakwa-grill-lounge',
      restaurantName: 'Abakwa Grill & Lounge',
      tableId: 'ag-t2',
      tableNumber: 12,
      tableZone: 'GARDEN CABANA',
      partySize: 4,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '19:30',
      customerName: "Manka'a Grace",
      customerPhone: '+237 699 22 18 34',
      specialRequests: 'Birthday dinner, please prepare fresh Kati Kati with warm fufu corn on arrival',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
  ]);

  // Toast notice state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch initial restaurants from server if available
  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setRestaurants(data.data);
        }
      })
      .catch(() => {
        // use local BAMENDA_RESTAURANTS
      });
  }, []);

  // Handlers for Dish Selection & Customization
  const handleOpenDishCustomizer = (dish: MenuItem, restaurantId?: string, restaurantName?: string) => {
    setSelectedDish(dish);
    const parent = restaurantId && restaurantName 
      ? { id: restaurantId, name: restaurantName }
      : selectedRestaurant 
      ? { id: selectedRestaurant.id, name: selectedRestaurant.name }
      : { id: BAMENDA_RESTAURANTS[0].id, name: BAMENDA_RESTAURANTS[0].name };

    setDishParentRestaurant(parent);
    setIsCustomizerOpen(true);
  };

  const handleAddToCart = (
    dish: MenuItem,
    quantity: number,
    customization: CartCustomization,
    restaurantId: string,
    restaurantName: string
  ) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItem: dish,
      quantity,
      customization,
      restaurantId,
      restaurantName
    };

    setCartItems(prev => [...prev, newItem]);
    showToast(`Added ${quantity}x "${dish.name}" to your Bamenda Feast!`);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Handlers for Table Booking
  const handleOpenTableBooking = (restaurant: Restaurant) => {
    setBookingTargetRestaurant(restaurant);
    setIsBookingModalOpen(true);
  };

  const handleReservationConfirmed = (newReservation: TableReservation) => {
    setReservations(prev => [newReservation, ...prev]);
    showToast(`Table #${newReservation.tableNumber} confirmed at ${newReservation.restaurantName}!`);
  };

  // Order Creation & Live Tracking
  const handleOrderCreated = (newOrder: Order) => {
    setActiveOrders(prev => [newOrder, ...prev]);
    setCurrentOrderForTracking(newOrder);
    setActiveTab('tracking');
    showToast(`Order #${newOrder.orderNumber} placed! Security PIN: ${newOrder.securityHandoverPin}`);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setActiveOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    if (currentOrderForTracking?.id === updatedOrder.id) {
      setCurrentOrderForTracking(updatedOrder);
    }
  };

  const handleVerifyOrderPin = (orderId: string, pin: string) => {
    setActiveOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: 'delivered',
          telemetryHistory: [
            ...ord.telemetryHistory,
            {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              lat: ord.deliveryAddress.lat,
              lng: ord.deliveryAddress.lng,
              speedKmH: 0,
              event: `Dispatched OTP Verification Succeeded. Handover PIN ${pin} validated.`
            }
          ]
        };
      }
      return ord;
    }));

    if (currentOrderForTracking?.id === orderId) {
      setCurrentOrderForTracking(curr => curr ? { ...curr, status: 'delivered' } : null);
    }
    showToast(`Physical Handover successfully confirmed with PIN ${pin}!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-white">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-amber-400/40 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'explore') {
            // Keep current view or return to list
          }
        }}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        hasActiveOrder={activeOrders.some(o => o.status !== 'delivered')}
        activeOrderCount={activeOrders.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* TAB 1: RESTAURANTS & MENU */}
        {activeTab === 'explore' && (
          <>
            {selectedRestaurant ? (
              <RestaurantDetail
                restaurant={selectedRestaurant}
                onBack={() => setSelectedRestaurant(null)}
                onSelectDish={(dish) => handleOpenDishCustomizer(dish, selectedRestaurant.id, selectedRestaurant.name)}
                onBookTable={(rest) => handleOpenTableBooking(rest)}
              />
            ) : (
              <RestaurantList
                restaurants={restaurants}
                onSelectRestaurantForMenu={(rest) => setSelectedRestaurant(rest)}
                onSelectRestaurantForBooking={(rest) => handleOpenTableBooking(rest)}
                onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
              />
            )}
          </>
        )}

        {/* TAB 2: TABLE BOOKING & PASSES */}
        {activeTab === 'reservations' && (
          <ReservationsList
            reservations={reservations}
            restaurants={restaurants}
            onBookAtRestaurant={(rest) => handleOpenTableBooking(rest)}
          />
        )}

        {/* TAB 3: REAL-TIME TRACKING & DRIVER MONITORING */}
        {activeTab === 'tracking' && (
          <LiveTrackingView
            order={currentOrderForTracking}
            onUpdateOrder={handleUpdateOrder}
            onNavigateExplore={() => {
              setSelectedRestaurant(null);
              setActiveTab('explore');
            }}
          />
        )}

        {/* TAB 4: DISPATCHER & FLEET SURVEILLANCE */}
        {activeTab === 'driver_monitor' && (
          <DriverDispatchMonitor
            activeOrders={activeOrders}
            onVerifyOrderPin={handleVerifyOrderPin}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="font-bold text-slate-800 text-sm font-serif">
              Bamenda<span className="text-amber-600">Dine</span> & Track
            </span>
            <p className="text-[11px] text-slate-400">
              Serving Commercial Avenue, Up Station, Mile 2-4 Nkwen, Small Mankon & Bambili.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
            <span>MTN Mobile Money (*126#)</span>
            <span>•</span>
            <span>Orange Money (#150#)</span>
            <span>•</span>
            <span>Anti-Theft OTP Handover</span>
            <span>•</span>
            <span>Real-time GPS Fleet</span>
          </div>

          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} Bamenda Dine. Made for Abakwa, North-West Region, Cameroon.
          </p>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Dish Customizer Modal */}
      <DishCustomizerModal
        dish={selectedDish}
        restaurantId={dishParentRestaurant?.id || ''}
        restaurantName={dishParentRestaurant?.name || ''}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* 2. Table Reservation Modal */}
      <TableReservationModal
        restaurant={bookingTargetRestaurant}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onReservationConfirmed={handleReservationConfirmed}
      />

      {/* 3. Cart & Checkout Modal with Local Payments */}
      <CartCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderCreated={handleOrderCreated}
      />

      {/* 4. AI Culinary Concierge Modal */}
      <AiCulinaryConcierge
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />

    </div>
  );
}
