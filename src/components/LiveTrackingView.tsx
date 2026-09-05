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
        <div className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto text-2xl border border-white/15 backdrop-blur-md shadow-xl">
          📡
        </div>
        <h3 className="text-xl font-bold text-white">No Active Delivery in Progress</h3>
        <p className="text-xs text-white/60 max-w-sm mx-auto leading-relaxed">
          You haven't placed an order yet. Select a restaurant in Commercial Avenue or Nkwen to start your real-time tracking experience!
        </p>
        <button
          onClick={onNavigateExplore}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all"
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
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-white/50">
              Live Bamenda Delivery Telemetry
            </span>
            <span className="text-xs font-mono font-bold text-orange-400 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              Order #{order.orderNumber}
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            {order.status === 'delivered' ? (
              <span className="text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                Delivered & Handover Verified!
              </span>
            ) : isArrived ? (
              <span className="text-orange-400 flex items-center gap-2">
                <Navigation className="w-6 h-6 animate-bounce" />
                Rider Arrived at Your Gate!
              </span>
            ) : (
              <span>Rider In Transit ({order.estimatedDeliveryTime} ETA)</span>
            )}
          </h2>

          <p className="text-xs text-white/70 mt-1">
            Delivering from <strong className="text-white">{order.restaurantName}</strong> to{' '}
            <strong className="text-white">{order.deliveryAddress.neighborhood}</strong> ({order.deliveryAddress.landmark})
          </p>
        </div>

        {/* Action Button: Driver Handover PIN / Completed */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Customer's Handover PIN Badge */}
          <div className="bg-white/10 border border-orange-500/50 backdrop-blur-md px-4 py-2 rounded-xl text-center shadow-lg">
            <span className="text-[10px] uppercase font-bold text-orange-300 block flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-orange-400" /> Handover Security PIN
            </span>
            <span className="font-mono text-xl font-black text-orange-400 tracking-widest">
              {order.securityHandoverPin}
            </span>
          </div>

          {order.status !== 'delivered' && (
            <button
              id="btn-trigger-handover-test"
              onClick={() => setShowHandoverModal(true)}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Simulate Driver PIN Verification</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Interactive Map & Telemetry HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Columns: Interactive Bamenda Topographic Map */}
        <div className="lg:col-span-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col text-white">
          
          {/* Map Top Bar */}
          <div className="bg-black/40 backdrop-blur-md text-white px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs">Bamenda Urban GPS Corridor</span>
              <span className="text-[10px] text-white/50 hidden sm:inline">• Commercial Ave to Mile 3 Nkwen</span>
            </div>

            {/* Simulation controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[10px] font-semibold flex items-center gap-1 border border-white/10 backdrop-blur-md"
                title="Pause / Resume telemetry feed"
              >
                {isSimulating ? <Pause className="w-3 h-3 text-orange-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                <span>{isSimulating ? 'Sim Active' : 'Paused'}</span>
              </button>
              
              <button
                onClick={() => setWaypointIndex(0)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[10px] border border-white/10"
                title="Restart route from Restaurant"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Interactive SVG/Canvas Visual Map of Bamenda */}
          <div className="relative w-full h-[380px] sm:h-[460px] bg-neutral-950/80 overflow-hidden flex items-center justify-center select-none">
            
            {/* Background Bamenda Topography / Grid lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Hillside Elevation Contour graphics for Up Station & Mankon Ridge */}
            <div className="absolute top-4 left-6 text-[10px] font-bold text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 shadow-md">
              ▲ Up Station Ridge (1,600m)
            </div>
            <div className="absolute bottom-4 left-6 text-[10px] font-bold text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 shadow-md">
              ▼ Commercial Ave / Food Market
            </div>
            <div className="absolute top-4 right-6 text-[10px] font-bold text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 shadow-md">
              ▶ Nkwen / Bambili Road Corridor
            </div>

            {/* Simulated Road Path SVG */}
            <svg className="absolute inset-0 w-full h-full p-8" viewBox="0 0 600 360">
              {/* Road background track */}
              <path
                d="M 60,280 C 140,280 180,240 240,210 C 300,180 340,150 420,120 C 480,100 520,70 540,50"
                fill="none"
                stroke="#334155"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Road center dashed line */}
              <path
                d="M 60,280 C 140,280 180,240 240,210 C 300,180 340,150 420,120 C 480,100 520,70 540,50"
                fill="none"
                stroke="#94a3b8"
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
                  <text y="18" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">
                    {pt.name}
                  </text>
                </g>
              ))}
            </svg>

            {/* Dynamic Rider Marker positioned based on current waypoint index */}
            {(() => {
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
                    <div className="w-11 h-11 rounded-full bg-neutral-950 border-2 border-emerald-400 shadow-xl flex items-center justify-center text-white text-lg">
                      <Bike className="w-5 h-5 text-orange-400 animate-pulse" />
                    </div>

                    {/* Rider Floating HUD tooltip */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-neutral-950/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl border border-white/20 shadow-2xl whitespace-nowrap pointer-events-none text-center">
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        {speed} km/h • Rider {order.driver?.name}
                      </div>
                      <div className="text-[9px] text-white/70 font-mono">
                        {currentWaypoint.name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Restaurant Origin Marker */}
            <div className="absolute bottom-12 left-10 z-10 text-center">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-lg mx-auto border-2 border-white">
                🍲
              </div>
              <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15 shadow-md mt-1 block">
                {order.restaurantName}
              </span>
            </div>

            {/* Customer Drop-off Marker */}
            <div className="absolute top-10 right-10 z-10 text-center">
              <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-lg mx-auto border-2 border-white">
                📍
              </div>
              <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15 shadow-md mt-1 block">
                {order.deliveryAddress.neighborhood}
              </span>
            </div>
          </div>

          {/* Current Road Node Status Ticker */}
          <div className="bg-black/30 backdrop-blur-md border-t border-white/10 p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-white/50 font-medium truncate">Current Landmark:</span>
              <strong className="text-white font-semibold truncate">
                {currentWaypoint.name} ({currentWaypoint.desc})
              </strong>
            </div>
            <span className="font-mono text-emerald-400 font-bold flex-shrink-0">
              {progressPercent}% Path Covered
            </span>
          </div>
        </div>

        {/* Right 4 Columns: Rider Profile, Telemetry & Security Telematics */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Rider Security Profile Card */}
          {order.driver && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl p-4 space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                  Assigned Courier Rider
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 backdrop-blur-md">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Verified Courier
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={order.driver.avatar}
                  alt={order.driver.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white/15 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white truncate">
                    {order.driver.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-white/60 mt-0.5">
                    <span className="text-amber-400 font-bold">★ {order.driver.rating}</span>
                    <span>•</span>
                    <span>{order.driver.totalTrips} Bamenda Deliveries</span>
                  </div>
                  <span className="text-[11px] font-mono text-white/70 font-medium block truncate mt-0.5">
                    {order.driver.motoModel} ({order.driver.plateNumber})
                  </span>
                </div>
              </div>

              {/* Real-time Telemetry Stats */}
              <div className="grid grid-cols-3 gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10 text-center text-white backdrop-blur-md">
                <div>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-white/50">
                    <Gauge className="w-3 h-3 text-emerald-400" /> Speed
                  </div>
                  <span className="font-mono font-bold text-xs text-white">
                    {speed} km/h
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-white/50">
                    <Battery className="w-3 h-3 text-amber-400" /> Battery
                  </div>
                  <span className="font-mono font-bold text-xs text-white">
                    {battery}%
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-white/50">
                    <Thermometer className="w-3 h-3 text-rose-400" /> Food Box
                  </div>
                  <span className="font-mono font-bold text-xs text-white">
                    64°C Hot
                  </span>
                </div>
              </div>

              {/* Call / WhatsApp Rider Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${order.driver.phone}`}
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Rider
                </a>
                <a
                  href={`https://wa.me/${order.driver.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 backdrop-blur-md transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Delivery Handover Security Verification Box */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-orange-500/30 p-4 space-y-3 text-white shadow-xl">
            <div className="flex items-center gap-2 text-orange-400">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider">
                Anti-Theft Handover Security
              </h4>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              When the rider reaches your gate in <strong>{order.deliveryAddress.neighborhood}</strong>, they will request your 4-digit Handover PIN:
            </p>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 flex items-center justify-between shadow-md">
              <span className="text-xs font-bold text-white/70">Your Handover Code:</span>
              <span className="font-mono text-2xl font-black text-orange-400 tracking-widest">
                {order.securityHandoverPin}
              </span>
            </div>

            {order.status === 'delivered' ? (
              <div className="bg-emerald-500/20 text-emerald-300 text-xs font-bold p-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Handover Successfully Verified & Sealed
              </div>
            ) : (
              <button
                id="btn-open-verify-modal-sidebar"
                onClick={() => setShowHandoverModal(true)}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/25"
              >
                Simulate Driver PIN Verification
              </button>
            )}
          </div>

          {/* Telemetry Event Log */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl p-4 space-y-2.5 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
              Audit Telemetry Log
            </span>
            <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
              {order.telemetryHistory.map((t, idx) => (
                <div key={idx} className="flex items-start gap-2 text-white/70">
                  <span className="font-mono text-[10px] text-white/60 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-neutral-900/90 backdrop-blur-2xl rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-white/15 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-sm text-white">
                  Driver Handover Terminal
                </h4>
              </div>
              <button
                onClick={() => setShowHandoverModal(false)}
                className="w-6 h-6 rounded-full text-white/50 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              The delivery rider must enter the customer's 4-digit PIN (<strong>{order.securityHandoverPin}</strong>) to release the parcel.
            </p>

            <form onSubmit={handleVerifyHandoverPin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-white/70 mb-1">
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
                  className="w-full text-center tracking-widest font-mono text-2xl font-bold py-2 bg-white/5 border border-white/20 text-white rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
                />
              </div>

              {verificationError && (
                <div className="text-xs text-rose-300 bg-rose-500/20 border border-rose-500/30 p-2 rounded-lg flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{verificationError}</span>
                </div>
              )}

              <button
                id="btn-confirm-driver-pin"
                type="submit"
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-500/25 transition-all"
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
