import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap } from './components/Map';
import { ControlPanel } from './components/ControlPanel';
import { CitySelector } from './components/CitySelector';
import { RouteStats, City, TravelMode } from './types';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

// 1. Safe Top-Level API Key Extraction
const RAW_API_KEY = process.env.API_KEY;

const getCleanApiKey = (): string | null => {
  try {
    let key = RAW_API_KEY;
    if (key === undefined || key === null) return null;
    let keyStr = String(key);
    keyStr = keyStr.trim();
    keyStr = keyStr.replace(/^['"]|['"]$/g, '');
    if (keyStr === 'undefined' || keyStr === 'null' || keyStr === '') return null;
    return keyStr;
  } catch (e) {
    return null;
  }
};

const App: React.FC = () => {
  const [activeCity, setActiveCity] = useState<City | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [routeStats, setRouteStats] = useState<RouteStats | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>('DRIVING');
  const [selectedCount, setSelectedCount] = useState(0);

  const loadingRef = useRef(false);

  useEffect(() => {
    // 0. Global Auth Failure Handler
    (window as any).gm_authFailure = () => {
      console.error("Google Maps Authentication Failure");
      setLoadError("API Key Error: Check billing status or restrictions in Cloud Console.");
      setIsScriptLoaded(false);
    };

    // 1. Check if already loaded
    if ((window as any).google && (window as any).google.maps) {
      setIsScriptLoaded(true);
      return;
    }

    if (loadingRef.current) return;
    loadingRef.current = true;

    // 2. Validate Key
    const apiKey = getCleanApiKey();
    if (!apiKey) {
      setLoadError("Configuration Error: API Key is missing or invalid.");
      return;
    }

    // 3. Check for existing script
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
        const interval = setInterval(() => {
            if ((window as any).google && (window as any).google.maps) {
                setIsScriptLoaded(true);
                clearInterval(interval);
            }
        }, 500);
        return;
    }

    // 4. Define Callback
    (window as any).initMapCallback = () => {
      setIsScriptLoaded(true);
    };

    // 5. Load Script
    const script = document.createElement('script');
    // Added libraries=geometry for distance calc in fallback mode
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&callback=initMapCallback&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setLoadError("Network Error: Unable to connect to Google Maps.");
      loadingRef.current = false;
    };

    document.head.appendChild(script);

    return () => {};
  }, []);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl max-w-md backdrop-blur-md animate-fade-in-up shadow-2xl shadow-red-900/20">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">System Access Denied</h2>
          <p className="text-slate-300 mb-4 text-sm leading-relaxed">{loadError}</p>
          <div className="bg-black/30 p-3 rounded text-left border border-red-500/20">
            <p className="text-[10px] text-red-300/70 font-mono">ERROR_CODE: MAPS_AUTH_FAIL</p>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Check console for details.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden font-sans text-slate-100 selection:bg-cyan-500/30">
      
      {!isScriptLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-slate-900">
          <div className="text-center">
            <h2 className="text-3xl font-black text-cyan-400 tracking-[0.5em] animate-pulse">NEONPATH</h2>
            <div className="mt-4 flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-300"></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 font-mono uppercase">Establishing Satellite Uplink...</p>
          </div>
        </div>
      )}

      {isScriptLoaded && (
        <>
          {!activeCity && (
            <CitySelector onSelectCity={setActiveCity} />
          )}

          {activeCity && (
            <>
              <div className="absolute top-4 left-4 z-30 pointer-events-auto">
                <button 
                  onClick={() => setActiveCity(null)}
                  className="bg-slate-900/80 backdrop-blur border border-slate-700 p-2.5 rounded-full text-slate-400 hover:text-white hover:border-cyan-500 transition-all shadow-xl group"
                  title="Return to City Select"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>

              <GoogleMap 
                activeCity={activeCity}
                travelMode={travelMode}
                routeStats={routeStats}
                setRouteStats={setRouteStats}
                onSelectionChange={setSelectedCount}
              />

              <ControlPanel 
                routeStats={routeStats}
                travelMode={travelMode}
                setTravelMode={setTravelMode}
                selectedCount={selectedCount}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
