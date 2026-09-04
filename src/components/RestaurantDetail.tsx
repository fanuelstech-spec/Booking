import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Bike, 
  CalendarDays, 
  Plus, 
  Flame, 
  Share2, 
  Sparkles 
} from 'lucide-react';
import { Restaurant, MenuItem } from '../types';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
  onSelectDish: (dish: MenuItem) => void;
  onBookTable: (restaurant: Restaurant) => void;
}

export const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
  restaurant,
  onBack,
  onSelectDish,
  onBookTable,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Delicacies' },
    { id: 'traditional', label: 'Traditional Achu & Feasts' },
    { id: 'grills', label: 'Kati Kati & Grills' },
    { id: 'soups_stews', label: 'Country Pepper Soups' },
    { id: 'drinks', label: 'Raffia Palm Wine & Juices' },
  ];

  const filteredMenu = selectedCategory === 'all' 
    ? restaurant.menu 
    : restaurant.menu.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Back Navigation */}
      <button
        id="btn-back-to-restaurants"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Bamenda Restaurants</span>
      </button>

      {/* Hero Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-lg">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={restaurant.bannerImage || restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

          {/* Floating Actions on banner */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => onBookTable(restaurant)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <CalendarDays className="w-3.5 h-3.5" /> Book a Table
            </button>
          </div>

          {/* Banner bottom details */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-amber-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
                Authentic Bamenda
              </span>
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-sm text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{restaurant.rating}</span>
                <span className="text-slate-300 font-normal">({restaurant.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white font-serif tracking-tight">
              {restaurant.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              {restaurant.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-3 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> {restaurant.address}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {restaurant.openingHours}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> {restaurant.phone}
              </span>
              <span className="flex items-center gap-1 text-amber-300 font-medium">
                <Bike className="w-3.5 h-3.5" /> Delivery: {restaurant.deliveryTimeEst} (from {restaurant.deliveryFeeBaseFCFA} FCFA)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMenu.map((dish) => (
          <div
            key={dish.id}
            id={`menu-item-${dish.id}`}
            onClick={() => onSelectDish(dish)}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex gap-4 group"
          >
            {/* Dish Photo */}
            <div className="relative w-24 sm:w-28 h-24 sm:h-28 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              {dish.isPopular && (
                <span className="absolute top-1 left-1 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                  POPULAR
                </span>
              )}
            </div>

            {/* Dish Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">
                    {dish.name}
                  </h3>
                  <span className="font-mono font-bold text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex-shrink-0">
                    {dish.priceFCFA.toLocaleString()} FCFA
                  </span>
                </div>

                {dish.localName && (
                  <span className="text-[11px] text-amber-700 font-medium block mt-0.5">
                    {dish.localName}
                  </span>
                )}

                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {dish.description}
                </p>
              </div>

              {/* Dish Meta: Spice level & Add Button */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                  {dish.spiciness !== 'none' && (
                    <span className="flex items-center gap-0.5 text-rose-600">
                      <Flame className="w-3 h-3" />
                      <span className="capitalize">{dish.spiciness.replace('_', ' ')}</span>
                    </span>
                  )}
                  <span>•</span>
                  <span>~{dish.prepTimeMinutes} mins prep</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDish(dish);
                  }}
                  className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center justify-center transition-colors"
                  title="Customize & Add to Cart"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
