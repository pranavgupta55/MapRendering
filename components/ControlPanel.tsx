import React, { useState, useEffect } from 'react';
import { RouteStats, TravelMode } from '../types';
import { 
  Car, 
  Footprints, 
  Bike, 
  Bus, 
  Keyboard, 
  MapPin
} from 'lucide-react';

interface ControlPanelProps {
  routeStats: RouteStats | null;
  travelMode: TravelMode;
  setTravelMode: (mode: TravelMode) => void;
  selectedCount: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  routeStats,
  travelMode,
  setTravelMode,
  selectedCount
}) => {
  const [showKeybinds, setShowKeybinds] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Top Right: System Status */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-lg shadow-2xl flex items-center gap-4 pointer-events-auto">
           <div className="text-right">
             <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">System Time</div>
             <div className="text-xs font-mono text-cyan-400">{currentTime}</div>
           </div>
           <div className="h-6 w-px bg-slate-700"></div>
           <div className="text-right">
             <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Data Stream</div>
             <div className="flex items-center justify-end gap-1.5">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               <span className="text-xs font-mono text-green-400">LIVE</span>
             </div>
           </div>
        </div>

        {/* Selected Points Indicator */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 px-3 py-2 rounded-lg shadow-lg pointer-events-auto transition-all">
          <div className="flex items-center gap-2 text-xs">
            <MapPin className={`w-3 h-3 ${selectedCount > 0 ? 'text-cyan-400' : 'text-slate-600'}`} />
            <span className="text-slate-400">Selection:</span>
            <span className={`font-mono font-bold ${selectedCount === 2 ? 'text-green-400' : 'text-white'}`}>
              {selectedCount}/2
            </span>
          </div>
        </div>
      </div>

      {/* Top Center: Travel Mode & Route Stats (Only visible when routing or calculating) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none">
        
        {/* Travel Mode Selector */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-1.5 rounded-full shadow-2xl flex gap-1 pointer-events-auto">
          <ModeButton 
            active={travelMode === 'DRIVING'} 
            onClick={() => setTravelMode('DRIVING')} 
            icon={<Car className="w-4 h-4" />} 
            label="Drive"
          />
          <ModeButton 
            active={travelMode === 'TRANSIT'} 
            onClick={() => setTravelMode('TRANSIT')} 
            icon={<Bus className="w-4 h-4" />} 
            label="Transit"
          />
          <ModeButton 
            active={travelMode === 'WALKING'} 
            onClick={() => setTravelMode('WALKING')} 
            icon={<Footprints className="w-4 h-4" />} 
            label="Walk"
          />
          <ModeButton 
            active={travelMode === 'BICYCLING'} 
            onClick={() => setTravelMode('BICYCLING')} 
            icon={<Bike className="w-4 h-4" />} 
            label="Bike"
          />
        </div>

        {/* Route Result Card */}
        {routeStats && (
          <div className="bg-slate-900/95 backdrop-blur-xl border-l-4 border-cyan-500 p-4 rounded-r-lg shadow-2xl min-w-[280px] animate-fade-in-up pointer-events-auto">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-cyan-400 font-bold text-sm tracking-wider uppercase">Optimal Route</h3>
              <span className="bg-cyan-500/10 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/20">
                FASTEST
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white">{routeStats.duration}</span>
            </div>
            <div className="text-slate-400 text-sm font-mono mt-1 flex items-center gap-2">
              <span>{routeStats.distance}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500 text-xs">Via Google Maps</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-slate-500 truncate max-w-[250px]">
               {routeStats.startAddress} → {routeStats.endAddress}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Left: Keybinds Modal */}
      <div className="absolute bottom-8 left-8 z-20 pointer-events-auto">
        <button 
          onClick={() => setShowKeybinds(!showKeybinds)}
          className="flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-slate-700 hover:border-cyan-500/50 p-2 rounded-lg text-slate-400 hover:text-white transition-all mb-2 shadow-lg"
        >
          <Keyboard className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Controls</span>
        </button>

        {showKeybinds && (
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-2xl w-64 animate-fade-in-up">
            <div className="space-y-3">
              <KeybindRow k="A" action="Drop Waypoint (Center)" />
              <KeybindRow k="Click Marker" action="Select Point" />
              <KeybindRow k="Ctrl + Drag" action="Rotate / Tilt Camera" />
              <KeybindRow k="Scroll" action="Zoom In / Out" />
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 leading-relaxed">
              Select exactly <strong className="text-cyan-400">2 markers</strong> to calculate the fastest route between them.
            </div>
          </div>
        )}
      </div>

      {/* Center Crosshair (Pure CSS) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 opacity-30">
         <div className="w-8 h-8 border border-white/50 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
         </div>
      </div>
    </>
  );
};

const ModeButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all
      ${active 
        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 scale-105' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }
    `}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);

const KeybindRow = ({ k, action }: { k: string, action: string }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-slate-400">{action}</span>
    <span className="bg-slate-800 border border-slate-700 text-cyan-400 font-mono px-2 py-0.5 rounded text-[10px] min-w-[24px] text-center shadow-inner">
      {k}
    </span>
  </div>
);