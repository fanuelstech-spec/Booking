import React from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Utensils, 
  PhoneCall, 
  QrCode
} from 'lucide-react';
import { Restaurant, TableReservation } from '../types';

interface ReservationsListProps {
  reservations: TableReservation[];
  restaurants: Restaurant[];
  onBookAtRestaurant: (restaurant: Restaurant) => void;
}

export const ReservationsList: React.FC<ReservationsListProps> = ({
  reservations,
  restaurants,
  onBookAtRestaurant,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-block mb-2">
            Fine Dining & Cultural Feasts
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
            Reserve Authentic Dining Tables in Bamenda
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
            Guarantee your seating at iconic spots across Abakwa — from panoramic sunset views over Bamenda valley at Up Station to traditional Toghu hearths in Small Mankon and Commercial Avenue.
          </p>
        </div>
      </div>

      {/* Confirmed Passes Section (If Any) */}
      {reservations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Your Confirmed Bamenda Dining Passes</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {reservations.length} Active Booking{reservations.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-amber-500/30 shadow-md relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase font-mono text-amber-400 font-bold">
                      TABLE PASS #{res.reservationNumber}
                    </span>
                    <h4 className="font-bold text-base text-white">
                      {res.restaurantName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Table</span>
                    <span className="text-xl font-black text-amber-400 font-mono">
                      #{res.tableNumber}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Guest</span>
                    <span className="font-semibold text-white truncate block">{res.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Date & Time</span>
                    <span className="font-semibold text-white truncate block">{res.date} @ {res.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Party Size</span>
                    <span className="font-semibold text-white">{res.partySize} Guests</span>
                  </div>
                </div>

                {res.specialRequests && (
                  <div className="text-[11px] bg-white/5 p-2 rounded border border-white/10 text-slate-300 mb-3">
                    <strong className="text-amber-300">Dining Note:</strong> {res.specialRequests}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Seating Guaranteed
                  </span>
                  <span className="text-slate-400 font-mono">
                    Tel: {res.customerPhone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Restaurants for Instant Booking */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900">
            Select a Restaurant to Book a Table
          </h3>
          <p className="text-xs text-slate-500">
            Instant table assignment with zero upfront reservation fee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-slate-100">
                <img
                  src={rest.image}
                  alt={rest.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] text-amber-300 font-bold block flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" /> {rest.neighborhood}
                  </span>
                  <h4 className="font-bold text-base text-white leading-tight">
                    {rest.name}
                  </h4>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-600 line-clamp-2">
                  {rest.tagline}
                </p>

                {/* Available Seating Zones */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Seating Zones
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {rest.tables.map(t => (
                      <span key={t.id} className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">
                        Table #{t.tableNumber} ({t.zone.replace('_', ' ')})
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onBookAtRestaurant(rest)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <CalendarDays className="w-4 h-4 text-emerald-300" />
                  <span>Reserve Table at {rest.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
