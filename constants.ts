import { City } from './types';

export const CITIES: City[] = [
  {
    id: 'philly',
    name: 'Philadelphia',
    description: 'The historic heart of America. Navigate between the towering skyline of Center City and the academic hub of UPenn.',
    // Centered slightly west to capture both City Hall and UPenn
    lat: 39.9524, 
    lng: -75.1780, 
    zoom: 15,
    tilt: 45,
    heading: 90, // Looking East towards the river
    highlights: ["Center City", "University of Pennsylvania", "Schuylkill River"]
  },
  {
    id: 'dallas',
    name: 'Dallas',
    description: 'A sprawling modern metropolis defined by its striking skyline, arts district, and deep cultural roots.',
    lat: 32.7767,
    lng: -96.7970,
    zoom: 16,
    tilt: 45,
    heading: 0,
    highlights: ["Reunion Tower", "Arts District", "Deep Ellum"]
  }
];

// Fallback if needed
export const INITIAL_CENTER = { lat: 37.7749, lng: -122.4194 }; 
export const INITIAL_ZOOM = 16;
export const INITIAL_TILT = 45;
export const INITIAL_HEADING = 0;

// Deep Blue / Neon Cyberpunk Map Style
export const DARK_MAP_STYLE: any[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#8ec3b9" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1a3646" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#4b6878" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64779e" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334e87" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#021019" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#283d6a" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6f9ba5" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.stroke",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#304a7d" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#98a5be" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1d2c4d" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2c6675" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#255763" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#b0d5ce" }],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{ color: "#98a5be" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#3a4762" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1626" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4e6d70" }],
  },
];