import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Phone, 
  Share2, 
  PartyPopper,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Restaurant, Table, TableReservation } from '../types';

interface TableReservationModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onReservationConfirmed: (reservation: TableReservation) => void;
}

export const TableReservationModal: React.FC<TableReservationModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  onReservationConfirmed,
}) => {
  if (!isOpen || !restaurant) return null;

  const [step, setStep] = useState<'select_table' | 'guest_details' | 'confirmed'>('select_table');
  const [selectedTable, setSelectedTable] = useState<Table | null>(
    restaurant.tables.find(t => !t.isReserved) || null
  );
  const [partySize, setPartySize] = useState<number>(2);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('19:00');
  
  // Guest details form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+237 67');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = ['12:30', '13:30', '17:30', '18:30', '19:00', '19:30', '20:30', '21:00'];

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedTable) return;

    setIsSubmitting(true);

    try {
      const payload = {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        tableId: selectedTable.id,
        tableNumber: selectedTable.tableNumber,
        tableZone: selectedTable.zone.replace('_', ' ').toUpperCase(),
        partySize,
        date: selectedDate,
        timeSlot,
        customerName,
        customerPhone,
        customerEmail,
        specialRequests
      };

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.data) {
        setConfirmedReservation(data.data);
        onReservationConfirmed(data.data);
        setStep('confirmed');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      // Offline fallback
      const fallback: TableReservation = {
        id: `res-${Date.now()}`,
        reservationNumber: `BDA-RES-${Math.floor(1000 + Math.random() * 9000)}`,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        tableId: selectedTable.id,
        tableNumber: selectedTable.tableNumber,
        tableZone: selectedTable.zone.replace('_', ' ').toUpperCase(),
        partySize,
        date: selectedDate,
        timeSlot,
        customerName,
        customerPhone,
        customerEmail,
        specialRequests,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      setConfirmedReservation(fallback);
      onReservationConfirmed(fallback);
      setStep('confirmed');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="reservation-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-sm bg-emerald-500/30 text-emerald-200 text-[11px] font-bold uppercase tracking-wider border border-emerald-400/30">
                VIP Table Reservation
              </span>
              <span className="text-xs text-emerald-100 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-300" /> {restaurant.neighborhood}
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              Reserve a Table at {restaurant.name}
            </h3>
          </div>
          <button
            id="btn-close-reservation-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 'select_table' && (
            <div className="space-y-6">
              {/* Date, Time & Party Size Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {timeSlots.map(t => (
                      <option key={t} value={t}>{t} (Evening Service)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" /> Party Size
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Interactive Visual Seating Map */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Select Your Preferred Seating Table
                  </label>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Reserved
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Selected
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {restaurant.tables.map((tbl) => {
                    const isSelected = selectedTable?.id === tbl.id;
                    const isReserved = !!tbl.isReserved;

                    return (
                      <div
                        key={tbl.id}
                        id={`table-card-${tbl.tableNumber}`}
                        onClick={() => !isReserved && setSelectedTable(tbl)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                          isReserved
                            ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
                            : isSelected
                            ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/30 shadow-xs'
                            : 'border-slate-200 hover:border-emerald-400 bg-white hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isSelected ? 'bg-amber-600 text-white' : isReserved ? 'bg-slate-300 text-slate-700' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              #{tbl.tableNumber}
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-800 capitalize">
                                {tbl.zone.replace('_', ' ')}
                              </div>
                              <span className="text-[10px] text-slate-500">
                                Up to {tbl.capacity} guests
                              </span>
                            </div>
                          </div>

                          {isReserved ? (
                            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                              Occupied
                            </span>
                          ) : isSelected ? (
                            <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded flex items-center gap-1">
                              ✓ Selected
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Available
                            </span>
                          )}
                        </div>

                        {/* Features Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tbl.features.map((feat, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Step Button */}
              <div className="pt-2 flex justify-end">
                <button
                  id="btn-proceed-guest-details"
                  type="button"
                  disabled={!selectedTable}
                  onClick={() => setStep('guest_details')}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-40"
                >
                  Continue to Guest Details →
                </button>
              </div>
            </div>
          )}

          {step === 'guest_details' && (
            <form onSubmit={handleConfirmReservation} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-emerald-900 font-bold">Selected Table #{selectedTable?.tableNumber}</span>
                  <p className="text-emerald-700 text-[11px]">
                    {selectedDate} at {timeSlot} • {partySize} Guests • {selectedTable?.zone.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('select_table')}
                  className="text-emerald-700 hover:text-emerald-900 underline font-semibold text-[11px]"
                >
                  Change Table
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Manka'a Grace / Bih Neba"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cameroon Phone (+237) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 67X XXX XXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Optional for e-ticket)
                </label>
                <input
                  type="email"
                  placeholder="name@example.cm"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Dining Notes or Celebrations
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Anniversary dinner, pre-chill fresh palm wine carafe, extra traditional stools, etc."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('select_table')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  ← Back
                </button>

                <button
                  id="btn-submit-reservation"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Confirming Table...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Reservation (Free)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'confirmed' && confirmedReservation && (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-md">
                <PartyPopper className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 font-serif">
                  Table Confirmed!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Your table at <strong className="text-slate-900">{confirmedReservation.restaurantName}</strong> is reserved and awaiting your arrival in Bamenda!
                </p>
              </div>

              {/* Digital Dining Pass Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl max-w-md mx-auto text-left shadow-xl relative overflow-hidden border border-amber-500/30">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>

                <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase font-bold text-amber-400">
                      BAMENDA DINING PASS
                    </span>
                    <h5 className="font-bold text-base text-white">
                      {confirmedReservation.restaurantName}
                    </h5>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Table No.</span>
                    <span className="text-xl font-black text-amber-400 font-mono">
                      #{confirmedReservation.tableNumber}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Guest Name</span>
                    <span className="font-semibold text-white">{confirmedReservation.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Date & Time</span>
                    <span className="font-semibold text-white">{confirmedReservation.date} @ {confirmedReservation.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Party Size</span>
                    <span className="font-semibold text-white">{confirmedReservation.partySize} Guests</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Booking Ref</span>
                    <span className="font-mono text-amber-300 font-bold">{confirmedReservation.reservationNumber}</span>
                  </div>
                </div>

                {confirmedReservation.specialRequests && (
                  <div className="text-[11px] bg-white/5 p-2 rounded border border-white/10 text-slate-300">
                    <strong className="text-amber-200">Notes:</strong> {confirmedReservation.specialRequests}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  id="btn-done-reservation"
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Back to Restaurants
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
