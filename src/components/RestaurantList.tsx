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
      <div className="relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl text-white p-6 sm:p-10 shadow-2xl border border-white/10">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
              Abakwa Food Hub • North-West Cameroon
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified OTP Delivery
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Taste Bamenda's Richest Hearth Delicacies.
          </h1>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-2xl">
            Order legendary Royal Achu Yellow Soup with smoked kanda, flame-charred Kati Kati with yellow fufu corn & fresh jamajama, or reserve panoramic tables in Up Station. Track your courier in real-time with anti-theft OTP handover and MTN MoMo / Orange Money payments.
          </p>

          {/* Quick Pillars */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-white/90">
              <Smartphone className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span>MTN MoMo & Orange Money</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-white/90">
              <Bike className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Real-Time GPS Benskin Track</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-white/90">
              <ShieldCheck className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span>4-Digit Handover PIN</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-white/90">
              <Utensils className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Instant Table Reservation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search dishes (Achu, Kati Kati, Roasted Fish) or restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
            />
          </div>

          {/* AI Guide Trigger */}
          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Ask Chef Bih AI</span>
          </button>
        </div>

        {/* Neighborhood Pill Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-white/50 font-medium text-[11px] mr-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-orange-400" /> Area:
          </span>
          {neighborhoods.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNeighborhood(n.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedNeighborhood === n.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 font-bold'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>

        {/* Specialty tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs border-t border-white/10 pt-3">
          <span className="text-white/50 font-medium text-[11px] mr-1">
            Cuisine:
          </span>
          {specialtyTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all ${
                selectedTag === tag.id
                  ? 'bg-white/20 text-white font-bold border border-white/30 shadow-md backdrop-blur-md'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
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
            <h2 className="text-xl font-bold text-white tracking-tight">
              Featured Restaurants in Bamenda
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              {filteredRestaurants.length} dining spots open for delivery & table reservations
            </p>
          </div>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-white/10 text-white/40 rounded-full flex items-center justify-center mx-auto text-xl border border-white/10">
              🔍
            </div>
            <h3 className="font-bold text-white text-sm">No Restaurants Found</h3>
            <p className="text-xs text-white/50">
              Try adjusting your search terms or selecting "All Abakwa (Bamenda)".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedNeighborhood('all');
                setSelectedTag('all');
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all"
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
