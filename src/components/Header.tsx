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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro-bar for Bamenda Region info */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live in Abakwa
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" /> Commercial Ave • Up Station • Nkwen • Mankon
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-slate-400">
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure OTP Driver Handover
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-amber-300 font-medium">MTN MoMo & Orange Money Active</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a 
              href="tel:+237677841920" 
              className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <PhoneCall className="w-3 h-3" /> +237 677 84 19 20
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
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-amber-900/10 transition-transform group-hover:scale-105">
              <Utensils className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 font-serif">
                  Bamenda<span className="text-amber-600">Dine</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 border border-amber-200">
                  Abakwa
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                Booking • Ordering • Live GPS Track
              </p>
            </div>
          </div>

          {/* Primary View Switcher */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80">
            <button
              id="nav-tab-explore"
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'explore'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Utensils className="w-4 h-4 text-amber-600" />
              <span>Restaurants & Menu</span>
            </button>

            <button
              id="nav-tab-reservations"
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'reservations'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              <span>Table Booking</span>
            </button>

            <button
              id="nav-tab-tracking"
              onClick={() => setActiveTab('tracking')}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'tracking'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Live Order Map</span>
              {hasActiveOrder && (
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              )}
            </button>

            <button
              id="nav-tab-driver-monitor"
              onClick={() => setActiveTab('driver_monitor')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'driver_monitor'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Bike className="w-4 h-4 text-amber-400" />
              <span>Driver Surveillance</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-700 px-1.5 py-0.5 rounded font-mono font-bold">
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
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl transition-all shadow-2xs group"
              title="Ask Abakwa Culinary AI"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Ask Chef Bih AI</span>
              <span className="sm:hidden">Chef AI</span>
            </button>

            {/* Cart Button */}
            <button
              id="btn-open-cart"
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl shadow-xs font-semibold text-sm transition-all hover:shadow-md"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {totalCartPrice > 0 && (
                <span className="font-mono text-xs bg-black/20 px-1.5 py-0.5 rounded">
                  {totalCartPrice.toLocaleString()} FCFA
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around gap-1 pt-2.5 border-t border-slate-200 mt-2.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'explore' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" /> Menu
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'reservations' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" /> Book Table
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold relative ${
              activeTab === 'tracking' ? 'bg-rose-100 text-rose-900 font-bold' : 'text-slate-600'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-500" /> Track Order
            {hasActiveOrder && <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>}
          </button>
          <button
            onClick={() => setActiveTab('driver_monitor')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'driver_monitor' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-amber-400" /> Fleet
          </button>
        </div>
      </div>
    </header>
  );
};
