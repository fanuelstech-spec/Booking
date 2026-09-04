import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  MapPin, 
  Battery, 
  Gauge, 
  Radio, 
  Phone, 
  Search, 
  CheckCircle2, 
  Clock, 
  Thermometer,
  KeyRound
} from 'lucide-react';
import { DeliveryRider, Order } from '../types';
import { MOCK_DELIVERY_RIDERS } from '../data/bamendaData';

interface DriverDispatchMonitorProps {
  activeOrders: Order[];
  onVerifyOrderPin?: (orderId: string, pin: string) => void;
}

export const DriverDispatchMonitor: React.FC<DriverDispatchMonitorProps> = ({
  activeOrders,
  onVerifyOrderPin
}) => {
  const [riders, setRiders] = useState<DeliveryRider[]>(MOCK_DELIVERY_RIDERS);
  const [selectedRider, setSelectedRider] = useState<DeliveryRider>(MOCK_DELIVERY_RIDERS[0]);
  const [filterQuery, setFilterQuery] = useState('');
  const [testPinInput, setTestPinInput] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  // Live telemetry pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setRiders(prev => prev.map(r => ({
        ...r,
        speedKmH: Math.floor(20 + Math.random() * 22),
        batteryPercent: Math.max(15, r.batteryPercent - (Math.random() > 0.8 ? 1 : 0))
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredRiders = riders.filter(r => 
    r.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.plateNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.currentStreetName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleTestPinVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPinInput) return;

    const matchingOrder = activeOrders.find(o => o.securityHandoverPin === testPinInput.trim());
    if (matchingOrder) {
      if (onVerifyOrderPin) {
        onVerifyOrderPin(matchingOrder.id, testPinInput.trim());
      }
      setTestResult({
        success: true,
        msg: `Verified! PIN ${testPinInput} matches Order #${matchingOrder.orderNumber} for ${matchingOrder.customerName}. Handover authorized.`
      });
      setTestPinInput('');
    } else {
      setTestResult({
        success: false,
        msg: `Verification Rejected: PIN ${testPinInput} does not match any active dispatched order. Handover blocked.`
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Bamenda Regional Dispatch & Fleet Surveillance
            </span>
          </div>
          <h2 className="text-2xl font-black text-white font-serif">
            Secure Delivery Driver Monitoring Center
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time GPS telemetry, speed monitoring, insulated hot-box temperature tracking, and anti-theft OTP security verification across Abakwa.
          </p>
        </div>

        {/* Global Fleet Telematics Counters */}
        <div className="flex items-center gap-2 sm:gap-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-400 block uppercase">Active Riders</span>
            <span className="font-mono text-xl font-bold text-emerald-400">{riders.length}</span>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-400 block uppercase">Fleet Safety</span>
            <span className="font-mono text-xl font-bold text-amber-300">100%</span>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-400 block uppercase">Active Orders</span>
            <span className="font-mono text-xl font-bold text-rose-400">{activeOrders.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Fleet List & Selected Rider Telematics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Fleet Roster */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Bike className="w-4 h-4 text-amber-600" />
              <span>Bamenda Courier Fleet</span>
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              GPS Synchronized
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search rider, plate or street..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Riders List */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto">
            {filteredRiders.map((rider) => {
              const isSelected = selectedRider.id === rider.id;
              return (
                <div
                  key={rider.id}
                  onClick={() => setSelectedRider(rider)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={rider.avatar}
                      alt={rider.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {rider.name}
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          {rider.speedKmH} km/h
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-500 block truncate font-mono">
                        {rider.plateNumber} • {rider.motoModel.split('(')[0]}
                      </span>

                      <span className="text-[10px] text-amber-800 font-medium block truncate mt-0.5">
                        📍 {rider.currentStreetName}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Selected Rider Telematics HUD & Security Verification Terminal */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Detailed Telemetry Monitor for Selected Rider */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedRider.avatar}
                  alt={selectedRider.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">
                      {selectedRider.name}
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Helmet Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedRider.motoModel} • Plate: {selectedRider.plateNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedRider.phone}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Dispatch Call
                </a>
              </div>
            </div>

            {/* Live Telematics Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-emerald-600" /> Speed Gauge
                </span>
                <span className="font-mono text-xl font-black text-slate-900 mt-1 block">
                  {selectedRider.speedKmH} <span className="text-xs font-normal text-slate-500">km/h</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Within City Limit (45)</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-amber-600" /> GPS Battery
                </span>
                <span className="font-mono text-xl font-black text-slate-900 mt-1 block">
                  {selectedRider.batteryPercent}%
                </span>
                <span className="text-[10px] text-slate-500">Power Mode: Optimal</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-600" /> Thermal Box
                </span>
                <span className="font-mono text-xl font-black text-slate-900 mt-1 block">
                  63°C
                </span>
                <span className="text-[10px] text-rose-600 font-medium">Hot Meal Sealed</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-blue-600" /> GPS Telemetry
                </span>
                <span className="font-mono text-sm font-bold text-slate-900 mt-1 block truncate">
                  5.9620°N, 10.1620°E
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Live 4G Stream</span>
              </div>
            </div>

            {/* Current Geo Location */}
            <div className="bg-amber-50/60 border border-amber-200/80 p-3.5 rounded-xl flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-950 block">
                  Current Sector: {selectedRider.currentStreetName}
                </span>
                <span className="text-[11px] text-amber-800">
                  Navigating key arteries of Bamenda Commercial Avenue & Nkwen. No traffic incident reported.
                </span>
              </div>
            </div>
          </div>

          {/* Secure Handover Verification Test Console */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Dispatcher Security Handover Terminal
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                Anti-fraud customer OTP verification
              </span>
            </div>

            <p className="text-xs text-slate-600">
              When a rider hands over hot food, the customer reveals their unique 4-digit code. Test or audit the verification engine here:
            </p>

            <form onSubmit={handleTestPinVerification} className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input
                type="text"
                maxLength={4}
                placeholder="Enter 4-digit PIN (e.g. 7429)"
                value={testPinInput}
                onChange={(e) => setTestPinInput(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-mono text-center tracking-widest text-base font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
              >
                Validate Security Handover
              </button>
            </form>

            {testResult && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                testResult.success 
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <span>{testResult.msg}</span>
              </div>
            )}
          </div>

          {/* Active Orders Handover Telematics Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Active Orders In Transit & Handover Codes
            </h3>

            {activeOrders.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No orders currently in transit.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {activeOrders.map((ord) => (
                  <div key={ord.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{ord.orderNumber}</span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {ord.restaurantName} → {ord.deliveryAddress.neighborhood}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Customer: {ord.customerName} ({ord.customerPhone})
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">OTP PIN</span>
                      <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {ord.securityHandoverPin}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
