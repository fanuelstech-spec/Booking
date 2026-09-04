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
      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
    >
      {/* Banner / Food Image */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl text-xs font-black text-slate-900 flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{restaurant.rating}</span>
          <span className="text-[10px] text-slate-400 font-normal">({restaurant.reviewCount})</span>
        </div>

        {/* Neighborhood Pill */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium mb-0.5">
            <MapPin className="w-3 h-3 text-amber-400" /> {restaurant.neighborhood}
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
            {restaurant.name}
          </h3>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {restaurant.tagline}
          </p>

          {/* Cuisine tags */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {restaurant.cuisines.map((c, i) => (
              <span
                key={i}
                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Delivery & Seating Stats */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{restaurant.deliveryTimeEst}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bike className="w-3.5 h-3.5 text-emerald-600" />
            <span>From {restaurant.deliveryFeeBaseFCFA} FCFA</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
            <span>{restaurant.tables.length} Tables</span>
          </div>
        </div>

        {/* Dual Actions: Order vs Reserve Table */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            id={`btn-order-${restaurant.id}`}
            type="button"
            onClick={() => onSelectForMenu(restaurant)}
            className="py-2.5 px-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Order Food</span>
          </button>

          <button
            id={`btn-book-${restaurant.id}`}
            type="button"
            onClick={() => onSelectForBooking(restaurant)}
            className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
            <span>Book Table</span>
          </button>
        </div>
      </div>
    </div>
  );
};
