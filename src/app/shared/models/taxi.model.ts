export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge?: string;
  features: string[];
  popular?: boolean;
}

export interface VehicleCategory {
  id: string;
  name: string;
  tagline: string;
  ratePerKm: number;
  capacity: string;
  luggage: string;
  ac: boolean;
  models: string;
  badge?: string;
  description: string;
  features: string[];
  colorHex: string;
  image?: string;
  interiorImage?: string;
  videoUrl?: string;
  specs: {
    seating: number;
    bags: number;
    fuel: string;
    comfort: string;
  };
}

export interface SmartRoute {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  estimatedDuration: string;
  highway: string;
  startingPrice: number;
  highlight: string;
  keyStops: string[];
  popular: boolean;
}

export interface CityCoverage {
  id: string;
  name: string;
  district: string;
  tagline: string;
  responseMinutes: number;
  coordinates: { x: number; y: number }; // SVG map percentage coordinates
  availableCabs: number;
  topRoutes: string[];
  isHQ?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  nameTa?: string;
  location: string;
  locationTa?: string;
  rating: number;
  date: string;
  dateTa?: string;
  comment: string;
  commentTa?: string;
  tripType: string;
  tripTypeTa?: string;
  avatar: string;
}

export interface FareBreakup {
  distanceKm: number;
  ratePerKm: number;
  baseFare: number;
  driverAllowance: number;
  estimatedToll: number;
  estimatedTotal: number;
  vehicleName: string;
  tripType: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  actions?: {
    label: string;
    action: string;
    url?: string;
  }[];
}
