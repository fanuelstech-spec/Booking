import React from 'react';
import { Star, MapPin, Clock, Bike, CalendarDays, Utensils } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelectForMenu: (restaurant: Restaurant) => void;
  onSelectForBooking: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelectForMenu,
  onSelectForBooking,
}) => {
  return (
    <div 
      id={`restaurant-card-${restaurant.id}`}
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/25 hover:bg-white/[0.08] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group text-white"
    >
      {/* Banner / Food Image */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-900">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-white flex items-center gap-1 border border-white/15 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{restaurant.rating}</span>
          <span className="text-[10px] text-white/50 font-normal">({restaurant.reviewCount})</span>
        </div>

        {/* Neighborhood Pill */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1 text-[11px] text-orange-400 font-medium mb-0.5">
            <MapPin className="w-3 h-3 text-orange-400" /> {restaurant.neighborhood}
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
            {restaurant.name}
          </h3>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
            {restaurant.tagline}
          </p>

          {/* Cuisine tags */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {restaurant.cuisines.map((c, i) => (
              <span
                key={i}
                className="text-[10px] bg-white/10 text-white/80 border border-white/10 px-2 py-0.5 rounded-md font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Delivery & Seating Stats */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-white/40" />
            <span>{restaurant.deliveryTimeEst}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bike className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white/80">From {restaurant.deliveryFeeBaseFCFA} FCFA</span>
          </div>
          <div className="flex items-center gap-1 text-white/80 font-medium">
            <CalendarDays className="w-3.5 h-3.5 text-orange-400" />
            <span>{restaurant.tables.length} Tables</span>
          </div>
        </div>

        {/* Dual Actions: Order vs Reserve Table */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            id={`btn-order-${restaurant.id}`}
            type="button"
            onClick={() => onSelectForMenu(restaurant)}
            className="py-2.5 px-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-1.5"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Order Food</span>
          </button>

          <button
            id={`btn-book-${restaurant.id}`}
            type="button"
            onClick={() => onSelectForBooking(restaurant)}
            className="py-2.5 px-3 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-bold transition-all backdrop-blur-md flex items-center justify-center gap-1.5"
          >
            <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
            <span>Book Table</span>
          </button>
        </div>
      </div>
    </div>
  );
};
