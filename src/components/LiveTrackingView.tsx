import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Clock, 
  Gauge, 
  Battery, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw, 
  Navigation,
  MessageSquare,
  Thermometer,
  Sparkles,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, OrderStatus } from '../types';
import { BAMENDA_WAYPOINTS } from '../data/bamendaData';

interface LiveTrackingViewProps {
  order: Order | null;
  onUpdateOrder: (updatedOrder: Order) => void;
  onNavigateExplore: () => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  order,
  onUpdateOrder,
  onNavigateExplore
}) => {
  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl">
          📡
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Active Delivery in Progress</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You haven't placed an order yet. Select a restaurant in Commercial Avenue or Nkwen to start your real-time tracking experience!
        </p>
        <button
          onClick={onNavigateExplore}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          Explore Bamenda Restaurants
        </button>
      </div>
    );
  }

  // Waypoint progress simulation (0 to BAMENDA_WAYPOINTS.length - 1)
  const [waypointIndex, setWaypointIndex] = useState<number>(3); // start midway
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(32);
  const [battery, setBattery] = useState<number>(order.driver?.batteryPercent || 86);
  const [handoverPinInput, setHandoverPinInput] = useState<string>('');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(order.status === 'delivered');
  const [showHandoverModal, setShowHandoverModal] = useState<boolean>(false);

  // Live simulation tick
  useEffect(() => {
    if (!isSimulating || order.status === 'delivered') return;

    const timer = setInterval(() => {
      setWaypointIndex((curr) => {
        if (curr >= BAMENDA_WAYPOINTS.length - 1) {
          return curr; // arrived
        }
        const next = curr + 1;
        // fluctuate speed realistically
        const nextSpeed = Math.floor(25 + Math.random() * 18);
        setSpeed(nextSpeed);
        return next;
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [isSimulating, order.status]);

  const currentWaypoint = BAMENDA_WAYPOINTS[waypointIndex];
  const isArrived = waypointIndex >= BAMENDA_WAYPOINTS.length - 1;

  // Handle Driver OTP PIN verification
  const handleVerifyHandoverPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);

    try {
      const res = await fetch(`/api/orders/${order.id}/verify-handover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinEntered: handoverPinInput })
      });
      const data = await res.json();

      if (data.success && data.data) {
        onUpdateOrder(data.data);
        setVerificationSuccess(true);
        setShowHandoverModal(false);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } else {
        setVerificationError(data.message || 'Incorrect Handover PIN. Security handover blocked.');
      }
    } catch (err) {
      // Local check fallback
      if (handoverPinInput.trim() === order.securityHandoverPin.trim()) {
        const updated: Order = {
          ...order,
          status: 'delivered',
          telemetryHistory: [
            ...order.telemetryHistory,
            {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              lat: order.deliveryAddress.lat,
              lng: order.deliveryAddress.lng,
              speedKmH: 0,
              event: `Secure Handover Verified with PIN ${handoverPinInput}. Handed to ${order.customerName}.`
            }
          ]
        };
        onUpdateOrder(updated);
        setVerificationSuccess(true);
        setShowHandoverModal(false);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } else {
        setVerificationError('Incorrect PIN. For safety, driver cannot release parcel without customer PIN.');
      }
    }
  };

  // Map progress percentage for SVG track
  const progressPercent = Math.round((waypointIndex / (BAMENDA_WAYPOINTS.length - 1)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Banner: Status & ETA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Bamenda Delivery Telemetry
            </span>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Order #{order.orderNumber}
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 font-serif">
            {order.status === 'delivered' ? (
              <span className="text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                Delivered & Handover Verified!
              </span>
            ) : isArrived ? (
              <span className="text-amber-600 flex items-center gap-2">
                <Navigation className="w-6 h-6 animate-bounce" />
                Rider Arrived at Your Gate!
              </span>
            ) : (
              <span>Rider In Transit ({order.estimatedDeliveryTime} ETA)</span>
            )}
          </h2>

          <p className="text-xs text-slate-600 mt-1">
            Delivering from <strong className="text-slate-800">{order.restaurantName}</strong> to{' '}
            <strong className="text-slate-800">{order.deliveryAddress.neighborhood}</strong> ({order.deliveryAddress.landmark})
          </p>
        </div>

        {/* Action Button: Driver Handover PIN / Completed */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Customer's Handover PIN Badge */}
          <div className="bg-amber-50 border-2 border-amber-400/80 px-4 py-2 rounded-xl text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-amber-900 block flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-amber-700" /> Handover Security PIN
            </span>
            <span className="font-mono text-xl font-black text-amber-800 tracking-widest">
              {order.securityHandoverPin}
            </span>
          </div>

          {order.status !== 'delivered' && (
            <button
              id="btn-trigger-handover-test"
              onClick={() => setShowHandoverModal(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Simulate Driver PIN Verification</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Interactive Map & Telemetry HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Columns: Interactive Bamenda Topographic Map */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* Map Top Bar */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs">Bamenda Urban GPS Corridor</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">• Commercial Ave to Mile 3 Nkwen</span>
            </div>

            {/* Simulation controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold flex items-center gap-1"
                title="Pause / Resume telemetry feed"
              >
                {isSimulating ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                <span>{isSimulating ? 'Sim Active' : 'Paused'}</span>
              </button>
              
              <button
                onClick={() => setWaypointIndex(0)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px]"
                title="Restart route from Restaurant"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Interactive SVG/Canvas Visual Map of Bamenda */}
          <div className="relative w-full h-[380px] sm:h-[460px] bg-gradient-to-b from-slate-100 via-emerald-50/20 to-slate-100 overflow-hidden flex items-center justify-center select-none">
            
            {/* Background Bamenda Topography / Grid lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Hillside Elevation Contour graphics for Up Station & Mankon Ridge */}
            <div className="absolute top-4 left-6 text-[10px] font-bold text-slate-600 bg-white/80 px-2 py-1 rounded border border-slate-200">
              ▲ Up Station Ridge (1,600m)
            </div>
            <div className="absolute bottom-4 left-6 text-[10px] font-bold text-slate-600 bg-white/80 px-2 py-1 rounded border border-slate-200">
              ▼ Commercial Ave / Food Market
            </div>
            <div className="absolute top-4 right-6 text-[10px] font-bold text-slate-600 bg-white/80 px-2 py-1 rounded border border-slate-200">
              ▶ Nkwen / Bambili Road Corridor
            </div>

            {/* Simulated Road Path SVG */}
            <svg className="absolute inset-0 w-full h-full p-8" viewBox="0 0 600 360">
              {/* Road background track */}
              <path
                d="M 60,280 C 140,280 180,240 240,210 C 300,180 340,150 420,120 C 480,100 520,70 540,50"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Road center dashed line */}
              <path
                d="M 60,280 C 140,280 180,240 240,210 C 300,180 340,150 420,120 C 480,100 520,70 540,50"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="6,6"
                strokeLinecap="round"
              />
              {/* Traveled active road track */}
              <path
                d="M 60,280 C 140,280 180,240 240,210 C 300,180 340,150 420,120 C 480,100 520,70 540,50"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray="600"
                strokeDashoffset={600 - (600 * (progressPercent / 100))}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />

              {/* Waypoint milestone dots */}
              {[
                { x: 60, y: 280, name: 'Commercial Ave Kitchen' },
                { x: 180, y: 240, name: 'City Chemist Roundabout' },
                { x: 260, y: 200, name: 'Hospital Roundabout' },
                { x: 380, y: 140, name: 'Mile 2 Nkwen' },
                { x: 540, y: 50, name: 'Customer Destination' }
              ].map((pt, idx) => (
                <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
                  <circle r="6" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
                  <text y="18" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600">
                    {pt.name}
                  </text>
                </g>
              ))}
            </svg>

            {/* Dynamic Rider Marker positioned based on current waypoint index */}
            {(() => {
              // Map waypoint index (0 to 6) to visual coordinates on the SVG curve
              const positions = [
                { top: '78%', left: '10%' },
                { top: '71%', left: '26%' },
                { top: '63%', left: '38%' },
                { top: '53%', left: '50%' },
                { top: '42%', left: '64%' },
                { top: '28%', left: '78%' },
                { top: '14%', left: '90%' }
              ];
              const pos = positions[Math.min(waypointIndex, positions.length - 1)];

              return (
                <div
                  className="absolute transition-all duration-1000 ease-out -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div className="relative group cursor-pointer">
                    {/* Radar Pulse */}
                    <div className="absolute -inset-3 bg-emerald-500 rounded-full animate-radar opacity-40"></div>

                    {/* Bike Marker Bubble */}
                    <div className="w-11 h-11 rounded-full bg-slate-900 border-2 border-emerald-400 shadow-xl flex items-center justify-center text-white text-lg">
                      <Bike className="w-5 h-5 text-amber-400 animate-pulse" />
                    </div>

                    {/* Rider Floating HUD tooltip */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-950/95 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl border border-slate-700 shadow-2xl whitespace-nowrap pointer-events-none text-center">
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        {speed} km/h • Rider {order.driver?.name}
                      </div>
                      <div className="text-[9px] text-slate-300 font-mono">
                        {currentWaypoint.name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Restaurant Origin Marker */}
            <div className="absolute bottom-12 left-10 z-10 text-center">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold shadow-lg mx-auto border-2 border-white">
                🍲
              </div>
              <span className="text-[10px] font-bold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-1 block">
                {order.restaurantName}
              </span>
            </div>

            {/* Customer Drop-off Marker */}
            <div className="absolute top-10 right-10 z-10 text-center">
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-lg mx-auto border-2 border-white">
                📍
              </div>
              <span className="text-[10px] font-bold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-1 block">
                {order.deliveryAddress.neighborhood}
              </span>
            </div>
          </div>

          {/* Current Road Node Status Ticker */}
          <div className="bg-slate-50 border-t border-slate-200 p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-slate-500 font-medium truncate">Current Landmark:</span>
              <strong className="text-slate-900 font-semibold truncate">
                {currentWaypoint.name} ({currentWaypoint.desc})
              </strong>
            </div>
            <span className="font-mono text-emerald-700 font-bold flex-shrink-0">
              {progressPercent}% Path Covered
            </span>
          </div>
        </div>

        {/* Right 4 Columns: Rider Profile, Telemetry & Security Telematics */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Rider Security Profile Card */}
          {order.driver && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Assigned Courier Rider
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Benskin Courier
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={order.driver.avatar}
                  alt={order.driver.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {order.driver.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="text-amber-600 font-bold">★ {order.driver.rating}</span>
                    <span>•</span>
                    <span>{order.driver.totalTrips} Bamenda Deliveries</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 font-medium block truncate mt-0.5">
                    {order.driver.motoModel} ({order.driver.plateNumber})
                  </span>
                </div>
              </div>

              {/* Real-time Telemetry Stats */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500">
                    <Gauge className="w-3 h-3 text-emerald-600" /> Speed
                  </div>
                  <span className="font-mono font-bold text-xs text-slate-900">
                    {speed} km/h
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500">
                    <Battery className="w-3 h-3 text-amber-600" /> Battery
                  </div>
                  <span className="font-mono font-bold text-xs text-slate-900">
                    {battery}%
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500">
                    <Thermometer className="w-3 h-3 text-rose-600" /> Food Box
                  </div>
                  <span className="font-mono font-bold text-xs text-slate-900">
                    64°C Hot
                  </span>
                </div>
              </div>

              {/* Call / WhatsApp Rider Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${order.driver.phone}`}
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Rider
                </a>
                <a
                  href={`https://wa.me/${order.driver.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Delivery Handover Security Verification Box */}
          <div className="bg-amber-50/70 rounded-2xl border-2 border-amber-300/80 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-900">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <h4 className="font-bold text-xs uppercase tracking-wider">
                Anti-Theft Handover Security
              </h4>
            </div>

            <p className="text-xs text-amber-950 leading-relaxed">
              When the rider reaches your gate in <strong>{order.deliveryAddress.neighborhood}</strong>, they will request your 4-digit Handover PIN:
            </p>

            <div className="bg-white p-3 rounded-xl border border-amber-300 flex items-center justify-between shadow-2xs">
              <span className="text-xs font-bold text-slate-600">Your Handover Code:</span>
              <span className="font-mono text-2xl font-black text-amber-700 tracking-widest">
                {order.securityHandoverPin}
              </span>
            </div>

            {order.status === 'delivered' ? (
              <div className="bg-emerald-100 text-emerald-800 text-xs font-bold p-2 rounded-lg text-center flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Handover Successfully Verified & Sealed
              </div>
            ) : (
              <button
                id="btn-open-verify-modal-sidebar"
                onClick={() => setShowHandoverModal(true)}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Simulate Driver PIN Verification
              </button>
            )}
          </div>

          {/* Telemetry Event Log */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Audit Telemetry Log
            </span>
            <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
              {order.telemetryHistory.map((t, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-600">
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                    {t.time}
                  </span>
                  <span className="text-[11px] leading-tight flex-1">
                    {t.event}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Driver PIN Handover Verification Modal */}
      {showHandoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900">
                  Driver Handover Terminal
                </h4>
              </div>
              <button
                onClick={() => setShowHandoverModal(false)}
                className="w-6 h-6 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              The delivery rider must enter the customer's 4-digit PIN (<strong>{order.securityHandoverPin}</strong>) to release the parcel.
            </p>

            <form onSubmit={handleVerifyHandoverPin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Enter 4-Digit Customer PIN *
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  autoFocus
                  placeholder="e.g. 7429"
                  value={handoverPinInput}
                  onChange={(e) => setHandoverPinInput(e.target.value)}
                  className="w-full text-center tracking-widest font-mono text-2xl font-bold py-2 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {verificationError && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{verificationError}</span>
                </div>
              )}

              <button
                id="btn-confirm-driver-pin"
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                Confirm Physical Handover
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
