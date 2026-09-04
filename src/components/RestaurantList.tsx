import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Smartphone, 
  Bike, 
  Utensils 
} from 'lucide-react';
import { Restaurant, MenuItem } from '../types';
import { RestaurantCard } from './RestaurantCard';

interface RestaurantListProps {
  restaurants: Restaurant[];
  onSelectRestaurantForMenu: (restaurant: Restaurant) => void;
  onSelectRestaurantForBooking: (restaurant: Restaurant) => void;
  onOpenAiAssistant: () => void;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  onSelectRestaurantForMenu,
  onSelectRestaurantForBooking,
  onOpenAiAssistant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  const neighborhoods = [
    { id: 'all', label: 'All Abakwa (Bamenda)' },
    { id: 'Commercial Avenue', label: 'Commercial Ave' },
    { id: 'Mile 2 Nkwen', label: 'Mile 2 Nkwen' },
    { id: 'Up Station', label: 'Up Station Ridge' },
    { id: 'Small Mankon', label: 'Small Mankon' }
  ];

  const specialtyTags = [
    { id: 'all', label: 'All Specialties' },
    { id: 'achu', label: 'Yellow Soup Achu 🍲' },
    { id: 'kati', label: 'Kati Kati & Fufu Corn 🍗' },
    { id: 'fish', label: 'Roasted Bar Fish 🐟' },
    { id: 'palm_wine', label: 'Fresh Palm Wine 🌴' }
  ];

  const filteredRestaurants = restaurants.filter(r => {
    // Neighborhood filter
    if (selectedNeighborhood !== 'all' && !r.neighborhood.includes(selectedNeighborhood)) {
      return false;
    }

    // Search query matches name, cuisines, or menu items
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = r.name.toLowerCase().includes(q);
      const matchesCuisine = r.cuisines.some(c => c.toLowerCase().includes(q));
      const matchesMenu = r.menu.some(m => 
        m.name.toLowerCase().includes(q) || 
        (m.localName && m.localName.toLowerCase().includes(q))
      );
      if (!matchesName && !matchesCuisine && !matchesMenu) {
        return false;
      }
    }

    // Tag filter
    if (selectedTag === 'achu') {
      return r.menu.some(m => m.name.toLowerCase().includes('achu') || m.description.toLowerCase().includes('achu'));
    }
    if (selectedTag === 'kati') {
      return r.menu.some(m => m.name.toLowerCase().includes('kati') || m.description.toLowerCase().includes('kati'));
    }
    if (selectedTag === 'fish') {
      return r.menu.some(m => m.name.toLowerCase().includes('fish') || m.name.toLowerCase().includes('bar'));
    }
    if (selectedTag === 'palm_wine') {
      return r.menu.some(m => m.name.toLowerCase().includes('palm wine'));
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Hero Culture Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-6 sm:p-10 shadow-xl border border-amber-500/20">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-600/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Abakwa Food Hub • North-West Cameroon
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified OTP Delivery
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-serif tracking-tight leading-tight">
            Taste Bamenda's Richest Hearth Delicacies.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Order legendary Royal Achu Yellow Soup with smoked kanda, flame-charred Kati Kati with yellow fufu corn & fresh jamajama, or reserve panoramic tables in Up Station. Track your courier in real-time with anti-theft OTP handover and MTN MoMo / Orange Money payments.
          </p>

          {/* Quick Pillars */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <Smartphone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>MTN MoMo & Orange Money</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <Bike className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Real-Time GPS Benskin Track</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span>4-Digit Handover PIN</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <Utensils className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Instant Table Reservation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search dishes (Achu, Kati Kati, Roasted Fish) or restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          {/* AI Guide Trigger */}
          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Ask Chef Bih AI</span>
          </button>
        </div>

        {/* Neighborhood Pill Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-medium text-[11px] mr-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-600" /> Area:
          </span>
          {neighborhoods.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNeighborhood(n.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedNeighborhood === n.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>

        {/* Specialty tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs border-t border-slate-100 pt-2.5">
          <span className="text-slate-400 font-medium text-[11px] mr-1">
            Cuisine:
          </span>
          {specialtyTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                selectedTag === tag.id
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Featured Restaurants in Bamenda
            </h2>
            <p className="text-xs text-slate-500">
              {filteredRestaurants.length} dining spots open for delivery & table reservations
            </p>
          </div>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No Restaurants Found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or selecting "All Abakwa (Bamenda)".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedNeighborhood('all');
                setSelectedTag('all');
              }}
              className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onSelectForMenu={onSelectRestaurantForMenu}
                onSelectForBooking={onSelectRestaurantForBooking}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
