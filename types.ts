export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  selected?: boolean;
}

export interface RouteStats {
  distance: string;
  duration: string;
  startAddress?: string;
  endAddress?: string;
}

export type TravelMode = 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';

export interface City {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  zoom: number;
  tilt: number;
  heading: number;
  highlights: string[];
}
