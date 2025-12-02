import React, { useEffect, useRef, useState } from 'react';
import { Waypoint, RouteStats, City, TravelMode } from '../types';
import { DARK_MAP_STYLE } from '../constants';
import { Compass, Box } from 'lucide-react';

interface MapProps {
  activeCity: City;
  travelMode: TravelMode;
  routeStats: RouteStats | null;
  setRouteStats: (stats: RouteStats | null) => void;
  onSelectionChange: (count: number) => void;
}

export const GoogleMap: React.FC<MapProps> = ({ 
  activeCity, 
  travelMode, 
  routeStats,
  setRouteStats,
  onSelectionChange
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const fallbackPolylineRef = useRef<any>(null);
  
  // State for internal logic
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showRouteBtn, setShowRouteBtn] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  
  // Use window.Map explicitly to avoid any potential shadowing of global Map constructor
  const markersMapRef = useRef<Map<string, any>>(new window.Map());

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;
    if (!(window as any).google) return;

    const map = new (window as any).google.maps.Map(mapRef.current, {
      center: { lat: activeCity.lat, lng: activeCity.lng },
      zoom: activeCity.zoom,
      tilt: activeCity.tilt,
      heading: activeCity.heading,
      mapTypeId: 'roadmap',
      styles: DARK_MAP_STYLE,
      disableDefaultUI: true,
      zoomControl: false,
      mapId: '9f6b95b46d06d3d9', // Demo Map ID for Vector features
      renderingType: 'VECTOR', // Force Vector for 3D buildings
      gestureHandling: 'greedy', 
    });

    googleMapRef.current = map;
    directionsServiceRef.current = new (window as any).google.maps.DirectionsService();
    directionsRendererRef.current = new (window as any).google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true, 
      polylineOptions: {
        strokeColor: '#22d3ee', // Cyan
        strokeWeight: 6,
        strokeOpacity: 0.8,
      }
    });

    // Cleanup
    return () => {
      markersMapRef.current.forEach((marker: any) => marker.setMap(null));
      markersMapRef.current.clear();
      fallbackPolylineRef.current?.setMap(null);
    };
  }, [activeCity]);

  // Force 3D Update on mount (helper for some devices)
  useEffect(() => {
     const timer = setTimeout(() => {
        if(googleMapRef.current) {
            googleMapRef.current.setTilt(activeCity.tilt);
            googleMapRef.current.setHeading(activeCity.heading);
        }
     }, 1000);
     return () => clearTimeout(timer);
  }, [activeCity]);

  // Handle Keybinds
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'a' && googleMapRef.current) {
        const center = googleMapRef.current.getCenter();
        const newWaypoint: Waypoint = {
          id: Date.now().toString(),
          lat: center.lat(),
          lng: center.lng(),
        };
        setWaypoints(prev => [...prev, newWaypoint]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync Markers
  useEffect(() => {
    if (!googleMapRef.current) return;

    waypoints.forEach(wp => {
      if (!markersMapRef.current.has(wp.id)) {
        // Create new marker
        const marker = new (window as any).google.maps.Marker({
          position: { lat: wp.lat, lng: wp.lng },
          map: googleMapRef.current,
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#64748b', // Default Slate
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          title: "Click to select",
        });

        // Add Click Listener for Selection
        marker.addListener("click", () => {
          setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(wp.id)) {
              next.delete(wp.id);
            } else {
              if (next.size >= 2) {
                 if (next.size === 2) {
                    next.clear(); // Reset if user clicks a 3rd to start over
                    next.add(wp.id);
                 }
              } else {
                next.add(wp.id);
              }
            }
            return next;
          });
        });

        markersMapRef.current.set(wp.id, marker);
      }
    });

  }, [waypoints]);

  // Handle Selection Visuals & Routing Button State
  useEffect(() => {
    onSelectionChange(selectedIds.size);
    setShowRouteBtn(selectedIds.size === 2);
    
    // Update Marker Visuals
    markersMapRef.current.forEach((marker: any, id: string) => {
      const isSelected = selectedIds.has(id);
      marker.setIcon({
        path: (window as any).google.maps.SymbolPath.CIRCLE,
        scale: isSelected ? 12 : 8,
        fillColor: isSelected ? '#22d3ee' : '#64748b',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: isSelected ? 3 : 2,
      });
      marker.setAnimation(isSelected ? (window as any).google.maps.Animation.BOUNCE : null);
      if (isSelected) setTimeout(() => marker.setAnimation(null), 700);
    });

    if (selectedIds.size !== 2) {
       // Clear route if selection changes
       directionsRendererRef.current?.setDirections({ routes: [] });
       fallbackPolylineRef.current?.setMap(null);
       setRouteStats(null);
    }
  }, [selectedIds, waypoints]);

  // Re-calculate when Travel Mode changes IF we already have a route
  useEffect(() => {
     if (selectedIds.size === 2 && routeStats) { // Only auto-update if already showing stats
         handleCalculateRoute();
     }
  }, [travelMode]);

  const handleCalculateRoute = () => {
      if (selectedIds.size !== 2) return;
      setIsRouting(true);

      const [startId, endId] = Array.from(selectedIds);
      const startWp = waypoints.find(w => w.id === startId);
      const endWp = waypoints.find(w => w.id === endId);

      if (!startWp || !endWp) return;

      directionsServiceRef.current?.route({
        origin: { lat: startWp.lat, lng: startWp.lng },
        destination: { lat: endWp.lat, lng: endWp.lng },
        travelMode: (window as any).google.maps.TravelMode[travelMode],
      }, (result: any, status: any) => {
        setIsRouting(false);
        
        if (status === 'OK' && result) {
          // Success: Use standard renderer
          fallbackPolylineRef.current?.setMap(null);
          directionsRendererRef.current?.setDirections(result);
          const leg = result.routes[0].legs[0];
          setRouteStats({
            distance: leg.distance?.text || '',
            duration: leg.duration?.text || '',
            startAddress: leg.start_address,
            endAddress: leg.end_address
          });
        } else {
           console.warn("Routing API failed (likely billing), using fallback.", status);
           
           // Fallback: Draw straight line
           directionsRendererRef.current?.setDirections({ routes: [] });
           
           if (!fallbackPolylineRef.current) {
               fallbackPolylineRef.current = new (window as any).google.maps.Polyline({
                   map: googleMapRef.current,
                   strokeColor: '#ef4444', // Red for fallback
                   strokeOpacity: 0.6,
                   strokeWeight: 4,
                   geodesic: true,
                   icons: [{
                       icon: { path: (window as any).google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
                       offset: '100%',
                       repeat: '50px'
                   }]
               });
           }
           fallbackPolylineRef.current.setPath([
             { lat: startWp.lat, lng: startWp.lng },
             { lat: endWp.lat, lng: endWp.lng }
           ]);
           fallbackPolylineRef.current.setMap(googleMapRef.current);

           // Calculate direct distance
           const distMeters = (window as any).google.maps.geometry?.spherical?.computeDistanceBetween(
               new (window as any).google.maps.LatLng(startWp.lat, startWp.lng),
               new (window as any).google.maps.LatLng(endWp.lat, endWp.lng)
           ) || 0;

           setRouteStats({
               distance: `${(distMeters / 1000).toFixed(2)} km`,
               duration: 'N/A',
               startAddress: 'Direct Path',
               endAddress: '(API Billing Required)'
           });
        }
      });
  };

  // Manual Controls
  const toggleTilt = () => {
    if (!googleMapRef.current) return;
    const currentTilt = googleMapRef.current.getTilt();
    googleMapRef.current.setTilt(currentTilt > 0 ? 0 : 45);
  };

  const rotateMap = () => {
    if (!googleMapRef.current) return;
    const currentHeading = googleMapRef.current.getHeading() || 0;
    googleMapRef.current.setHeading(currentHeading + 90);
  };

  return (
    <div className="relative w-full h-full">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* On-Screen Controls */}
        <div className="absolute bottom-32 right-8 flex flex-col gap-2 z-20">
             <button 
                onClick={toggleTilt}
                className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 hover:border-cyan-500 text-cyan-400 shadow-lg transition-all"
                title="Toggle 2D/3D"
             >
                <Box className="w-6 h-6" />
             </button>
             <button 
                onClick={rotateMap}
                className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 hover:border-cyan-500 text-cyan-400 shadow-lg transition-all"
                title="Rotate 90°"
             >
                <Compass className="w-6 h-6" />
             </button>
        </div>

        {/* Calculate Route Trigger */}
        {showRouteBtn && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 animate-fade-in-up">
                <button
                   onClick={handleCalculateRoute}
                   disabled={isRouting}
                   className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-wider py-3 px-8 rounded-full shadow-lg shadow-cyan-500/50 transition-all scale-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   {isRouting ? 'Computing...' : 'Calculate Route'}
                </button>
            </div>
        )}
    </div>
  );
};