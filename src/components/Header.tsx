import React from 'react';
import { 
  Utensils, 
  MapPin, 
  ShoppingBag, 
  CalendarDays, 
  Radio, 
  ShieldCheck, 
  Sparkles,
  Bike,
  PhoneCall
} from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  activeTab: 'explore' | 'reservations' | 'tracking' | 'driver_monitor';
  setActiveTab: (tab: 'explore' | 'reservations' | 'tracking' | 'driver_monitor') => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenAiAssistant: () => void;
  hasActiveOrder: boolean;
  activeOrderCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartItems,
  onOpenCart,
  onOpenAiAssistant,
  hasActiveOrder,
  activeOrderCount
}) => {
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, item) => acc + item.menuItem.priceFCFA * item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/60 backdrop-blur-xl border-b border-white/10 text-white shadow-lg">
      {/* Top micro-bar for Bamenda Region info */}
      <div className="bg-black/40 backdrop-blur-md text-white/70 text-xs py-1.5 px-4 sm:px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live in Abakwa
            </span>
            <span className="text-white/20">•</span>
            <span className="text-white/70 flex items-center gap-1 text-[11px]">
              <MapPin className="w-3 h-3 text-orange-400" /> Commercial Ave • Up Station • Nkwen • Mankon
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-white/60 text-[11px]">
            <span className="hidden sm:inline-flex items-center gap-1 text-white/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure OTP Driver Handover
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="text-yellow-400 font-medium">MTN MoMo & Orange Money Active</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <a 
              href="tel:+237677841920" 
              className="text-white/70 hover:text-white flex items-center gap-1 transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-orange-400" /> +237 677 84 19 20
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-orange-500/25 transition-transform group-hover:scale-105">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Bamenda<span className="text-orange-500">Dine</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-orange-400 border border-white/10">
                  Abakwa
                </span>
              </div>
              <p className="text-xs text-white/50 font-medium flex items-center gap-1">
                Booking • Ordering • Live GPS Track
              </p>
            </div>
          </div>

          {/* Primary View Switcher */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            <button
              id="nav-tab-explore"
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'explore'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Restaurants & Menu</span>
            </button>

            <button
              id="nav-tab-reservations"
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'reservations'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Table Booking</span>
            </button>

            <button
              id="nav-tab-tracking"
              onClick={() => setActiveTab('tracking')}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tracking'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Live Order Map</span>
              {hasActiveOrder && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>

            <button
              id="nav-tab-driver-monitor"
              onClick={() => setActiveTab('driver_monitor')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'driver_monitor'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Driver Surveillance</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                PRO
              </span>
            </button>
          </nav>

          {/* Right Action Group: AI Sommelier & Cart */}
          <div className="flex items-center gap-2.5">
            
            {/* Chef AI Assistant Button */}
            <button
              id="btn-open-ai-concierge"
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all shadow-lg shadow-emerald-500/10 group backdrop-blur-md"
              title="Ask Abakwa Culinary AI"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Chef Bih AI</span>
              <span className="sm:hidden">Chef AI</span>
            </button>

            {/* Cart Button */}
            <button
              id="btn-open-cart"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/25 font-semibold text-xs sm:text-sm transition-all"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {totalCartPrice > 0 && (
                <span className="font-mono text-xs bg-black/30 px-1.5 py-0.5 rounded border border-white/10">
                  {totalCartPrice.toLocaleString()} FCFA
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around gap-1 pt-2.5 border-t border-white/10 mt-2.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'explore' ? 'bg-orange-500 text-white font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" /> Menu
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'reservations' ? 'bg-orange-500 text-white font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" /> Book Table
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold relative ${
              activeTab === 'tracking' ? 'bg-orange-500 text-white font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" /> Track Order
            {hasActiveOrder && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
          </button>
          <button
            onClick={() => setActiveTab('driver_monitor')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'driver_monitor' ? 'bg-orange-500 text-white font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-amber-300" /> Fleet
          </button>
        </div>
      </div>
    </header>
  );
};
