import { Injectable, signal } from '@angular/core';
import { VehicleCategory, ServiceItem, SmartRoute, CityCoverage, Testimonial, FareBreakup } from '../models/taxi.model';

@Injectable({
  providedIn: 'root'
})
export class TaxiDataService {
  readonly company = {
    name: 'Rider Call Taxi',
    tagline: 'Ride Across Tamil Nadu With Comfort & Confidence',
    phone1: '+91 9363015586',
    phone2: '+91 9363715586',
    rawPhone1: '919363015586',
    rawPhone2: '919363715586',
    email: 'ridercalltaxi@gmail.com',
    addressLine: '757A/7, First Floor, MPM Complex, Rajapalayam Main Road, NGO Colony Opposite Panchayat Union Office',
    city: 'Sankarankovil',
    pincode: '627756',
    state: 'Tamil Nadu',
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3937.495200385966!2d77.5332!3d9.1724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMTAnMjAuNiJOIDc3wrAzMicwMC4wIkU!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
    googleMapsDirectionsUrl: 'https://maps.google.com/?q=MPM+Complex+Rajapalayam+Main+Road+Sankarankovil+627756'
  };

  // Base rate as per master plan: 1 KM = ₹14
  readonly baseRatePerKm = 14;

  readonly vehicleCategories: VehicleCategory[] = [
    {
      id: 'hatchback',
      name: 'Hatchback',
      tagline: 'Budget Friendly City Travel',
      ratePerKm: 14,
      capacity: '4 Passengers',
      luggage: '2 Medium Bags',
      ac: true,
      models: 'WagonR, Swift, Tiago, Celerio',
      badge: 'Best Value',
      description: 'Compact, efficient and pocket-friendly ride ideal for short city trips, grocery runs, station pickups, and everyday errands.',
      features: ['Full Air Conditioning', 'Clean Sanitized Seats', 'GPS Live Tracking', 'Pocket Friendly ₹14/KM'],
      colorHex: '#FFC107',
      image: '/images/fleet/hatchback.jpg',
      interiorImage: '/images/fleet/interior.jpg',
      specs: {
        seating: 4,
        bags: 2,
        fuel: 'Petrol / CNG',
        comfort: 'Standard'
      }
    },
    {
      id: 'sedan',
      name: 'Sedan',
      tagline: 'Comfort Travel & Smooth Cruising',
      ratePerKm: 15,
      capacity: '4 Passengers',
      luggage: '3 Large Bags',
      ac: true,
      models: 'Swift Dzire, Toyota Etios, Hyundai Aura, Honda Amaze',
      badge: 'Most Popular',
      description: 'Extra legroom, generous boot space, and whisper-quiet suspension for airport drops, business visits, and inter-city outstation commutes.',
      features: ['Ample Legroom & Boot Space', 'Smooth Highway Ride', 'Music & Phone Charging', 'Toll & Fastag Ready'],
      colorHex: '#2563EB',
      image: '/images/fleet/sedan.jpg',
      interiorImage: '/images/fleet/interior.jpg',
      videoUrl: '/assets/videos/Sedan (Dzire  Etios).mp4',
      specs: {
        seating: 4,
        bags: 3,
        fuel: 'Diesel / Petrol',
        comfort: 'Executive'
      }
    },
    {
      id: 'suv',
      name: 'SUV / MUV',
      tagline: 'Family Trips & Pilgrim Tours',
      ratePerKm: 19,
      capacity: '6-7 Passengers',
      luggage: '5 Bags',
      ac: true,
      models: 'Toyota Innova, Innova Crysta, Maruti Ertiga, Mahindra Marazzo',
      badge: 'Family Choice',
      description: 'Spacious 6-7 seaters tailored for temple pilgrimages, family holidays, long-distance highways, and hill stations.',
      features: ['Dual AC Vents for all rows', 'Reclining Captain Seats', 'Heavy Luggage Carrier', 'Experienced Highway Driver'],
      colorHex: '#D32F2F',
      image: '/images/fleet/suv.jpg',
      interiorImage: '/images/fleet/interior.jpg',
      specs: {
        seating: 7,
        bags: 5,
        fuel: 'Turbo Diesel',
        comfort: 'Premium Comfort'
      }
    },
    {
      id: 'tempo',
      name: 'Tempo Traveller',
      tagline: 'Group Travel & Wedding Parties',
      ratePerKm: 24,
      capacity: '12-14 Passengers',
      luggage: '10+ Bags',
      ac: true,
      models: 'Force Urbania, Tempo Traveller 14-Seater Deluxe',
      badge: 'Large Groups',
      description: 'Spacious high-roof bus coach with pushback bucket seats, LED screens, and massive luggage storage for wedding barats and extended family tours.',
      features: ['Pushback Luxury Seats', 'Ample Overhead Luggage', 'HD TV & Surround Sound', 'First Aid & Emergency Support'],
      colorHex: '#10B981',
      image: '/images/fleet/tempo.jpg',
      interiorImage: '/images/fleet/interior.jpg',
      specs: {
        seating: 14,
        bags: 12,
        fuel: 'Commercial Diesel',
        comfort: 'Touring Luxury'
      }
    },
    {
      id: 'corporate',
      name: 'Corporate Cab',
      tagline: 'VIP & Executive Transport',
      ratePerKm: 22,
      capacity: '4-6 Passengers',
      luggage: '4 Bags',
      ac: true,
      models: 'Innova Crysta VIP, Toyota Fortuner, Honda City',
      badge: 'Executive',
      description: 'Elite fleet with English-speaking verified chauffeurs, mineral water, tissue box, sanitized cabins, and GST invoice support.',
      features: ['Uniformed Chauffeur', 'Complimentary Water & Tissue', 'GST Tax Invoice Provided', 'Priority 24/7 Desk'],
      colorHex: '#0F172A',
      image: '/images/fleet/corporate.jpg',
      interiorImage: '/images/fleet/interior.jpg',
      specs: {
        seating: 6,
        bags: 4,
        fuel: 'Premium Diesel',
        comfort: 'First Class'
      }
    }
  ];

  readonly services: ServiceItem[] = [
    {
      id: 'local-ride',
      title: 'Local Ride',
      subtitle: 'Fast Sankarankovil Point-to-Point',
      description: 'Instant pickups within Sankarankovil, Rajapalayam, Tenkasi, and surrounding towns with transparent meter pricing and polite local drivers.',
      icon: 'map-pin',
      badge: 'Fast Pickup',
      features: ['Doorstep pickup in 10 mins', 'No surge pricing during rush hour', 'Local drivers familiar with every street']
    },
    {
      id: 'airport-transfer',
      title: 'Airport Transfer',
      subtitle: 'Madurai, Tuticorin & Trivandrum',
      description: 'Punctual 24/7 airport drops and arrivals with flight monitoring, luggage assistance, and zero delays for your important flights.',
      icon: 'plane',
      popular: true,
      badge: '24/7 On-Time',
      features: ['Madurai Airport (120 KM)', 'Trivandrum Airport (130 KM)', 'Tuticorin Airport (95 KM)', 'Flight delay buffer time']
    },
    {
      id: 'outstation-taxi',
      title: 'Outstation Taxi',
      subtitle: 'One-Way & Round Trips across TN',
      description: 'Affordable one-way drops and round-trip long distance rides to Chennai, Coimbatore, Bangalore, Trichy, and Madurai at fixed ₹14/KM rates.',
      icon: 'compass',
      popular: true,
      badge: 'Lowest Tariff',
      features: ['Pay only for one-way on select drops', 'Fastag equipped vehicles', 'Night driving verified experts']
    },
    {
      id: 'corporate-travel',
      title: 'Corporate Travel',
      subtitle: 'Executive Billing & Chauffeurs',
      description: 'Dedicated transport management for companies, executives, industrial visitors to Rajapalayam textile hubs, and VIP guests.',
      icon: 'briefcase',
      features: ['Monthly consolidated GST billing', 'Clean executive cars', 'Strict punctuality agreement']
    },
    {
      id: 'temple-tourism',
      title: 'Temple Tourism Packages',
      subtitle: 'South Tamil Nadu Heritage Circuits',
      description: 'Customized pilgrimage tours to Sankarankovil Sankaranarayanaswamy Temple, Tiruchendur, Madurai Meenakshi, Rameswaram, and Palani.',
      icon: 'landmark',
      popular: true,
      badge: 'Spiritual Special',
      features: ['Custom darshan waiting time', 'Temple town route experts', 'Senior citizen friendly cabs']
    },
    {
      id: 'wedding-transportation',
      title: 'Wedding Transportation',
      subtitle: 'Bridal Cars & Guest Convoys',
      description: 'Decorated luxury bridal cars and coordinated fleet of Sedans, SUVs, and Tempo Travellers for hassle-free wedding celebrations.',
      icon: 'heart',
      features: ['Decorated bridal car options', 'Multiple pickup coordination', 'Dedicated fleet manager on-call']
    },
    {
      id: 'event-transportation',
      title: 'Event Transportation',
      subtitle: 'Conferences, Festivals & Sports',
      description: 'Reliable mass transport logistics for college functions, political gatherings, sports events, and family reunions.',
      icon: 'users',
      features: ['Bulk fleet discounts', 'Real-time vehicle coordination', '24/7 dispatch supervisor']
    },
    {
      id: 'round-trip-services',
      title: 'Round Trip Services',
      subtitle: 'Relaxed Same-day or Multi-day Tours',
      description: 'Book a cab for the entire day or multi-day trip with transparent per-km billing, minimal waiting charges, and friendly driver.',
      icon: 'repeat',
      features: ['Flexible halts anywhere', 'Low driver beta charge', 'Transparent kilometre calculation']
    }
  ];

  readonly smartRoutes: SmartRoute[] = [
    {
      id: 'snk-madurai',
      from: 'Sankarankovil',
      to: 'Madurai (Airport / Meenakshi Amman)',
      distanceKm: 120,
      estimatedDuration: '2 hrs 15 mins',
      highway: 'NH 744 & NH 44',
      startingPrice: 1680,
      highlight: 'Direct AIIMS & Airport access. Popular daily commuter and pilgrim route.',
      keyStops: ['Rajapalayam', 'Srivilliputhur Andal Temple', 'Thirumangalam'],
      popular: true
    },
    {
      id: 'tirunelveli-chennai',
      from: 'Tirunelveli',
      to: 'Chennai (Koyambedu / Airport)',
      distanceKm: 620,
      estimatedDuration: '9 hrs 30 mins',
      highway: 'Grand Southern Trunk (GST) NH 44 / NH 38',
      startingPrice: 8680,
      highlight: 'Smooth 4-lane expressway journey with planned hygienic food stopovers.',
      keyStops: ['Madurai', 'Trichy', 'Villupuram', 'Chengalpattu'],
      popular: true
    },
    {
      id: 'tenkasi-airport',
      from: 'Tenkasi / Courtallam',
      to: 'Madurai / Trivandrum Airport',
      distanceKm: 115,
      estimatedDuration: '2 hrs 30 mins',
      highway: 'SH 40 / NH 744',
      startingPrice: 1610,
      highlight: 'Scenic route through Western Ghats foothills with reliable airport drop timing.',
      keyStops: ['Surandai', 'Kadayanallur', 'Rajapalayam'],
      popular: true
    },
    {
      id: 'madurai-rameswaram',
      from: 'Madurai',
      to: 'Rameswaram (Pamban Bridge)',
      distanceKm: 175,
      estimatedDuration: '3 hrs 15 mins',
      highway: 'NH 87 (Pamban Highway)',
      startingPrice: 2450,
      highlight: 'Iconic coastal highway driving past Pamban sea bridge and Ramanathaswamy Temple.',
      keyStops: ['Manamadurai', 'Paramakudi', 'Ramanathapuram', 'Mandapam'],
      popular: true
    },
    {
      id: 'snk-tiruchendur',
      from: 'Sankarankovil',
      to: 'Tiruchendur (Murugan Sea Temple)',
      distanceKm: 110,
      estimatedDuration: '2 hrs 20 mins',
      highway: 'SH 41 & SH 93',
      startingPrice: 1540,
      highlight: 'The holiest coastal pilgrim route. Same-day darshan return package available.',
      keyStops: ['Kayathar', 'Tirunelveli Outer', 'Spic Nagar', 'Arumuganeri'],
      popular: true
    },
    {
      id: 'snk-kanyakumari',
      from: 'Sankarankovil',
      to: 'Kanyakumari (Southern Tip)',
      distanceKm: 160,
      estimatedDuration: '3 hrs 10 mins',
      highway: 'NH 44 Expressway',
      startingPrice: 2240,
      highlight: 'Catch sunrise or sunset at Cape Comorin, Vivekananda Rock Memorial and Thiruvalluvar Statue.',
      keyStops: ['Tirunelveli Bypass', 'Nanguneri', 'Panagudi', 'Aralvaimozhi'],
      popular: false
    }
  ];

  readonly citiesCoverage: CityCoverage[] = [
    {
      id: 'sankarankovil',
      name: 'Sankarankovil',
      district: 'Tenkasi Dist',
      tagline: 'Headquarters & Primary Dispatch Hub',
      responseMinutes: 8,
      coordinates: { x: 38, y: 78 },
      availableCabs: 45,
      topRoutes: ['To Madurai', 'To Tiruchendur', 'To Tenkasi', 'To Chennai'],
      isHQ: true
    },
    {
      id: 'tenkasi',
      name: 'Tenkasi & Courtallam',
      district: 'Tenkasi Dist',
      tagline: 'Kasi Viswanathar & Waterfalls Gateway',
      responseMinutes: 12,
      coordinates: { x: 32, y: 82 },
      availableCabs: 32,
      topRoutes: ['Courtallam Tours', 'To Trivandrum', 'To Sankarankovil']
    },
    {
      id: 'tirunelveli',
      name: 'Tirunelveli',
      district: 'Tirunelveli Dist',
      tagline: 'Halwa City & Railway Junction Hub',
      responseMinutes: 10,
      coordinates: { x: 44, y: 84 },
      availableCabs: 60,
      topRoutes: ['To Chennai', 'To Bangalore', 'To Sankarankovil', 'To Nagercoil']
    },
    {
      id: 'rajapalayam',
      name: 'Rajapalayam',
      district: 'Virudhunagar Dist',
      tagline: 'Industrial & Ayyanar Falls Hub',
      responseMinutes: 10,
      coordinates: { x: 41, y: 72 },
      availableCabs: 28,
      topRoutes: ['To Madurai Airport', 'To Sankarankovil', 'To Coimbatore']
    },
    {
      id: 'madurai',
      name: 'Madurai',
      district: 'Madurai Dist',
      tagline: 'Temple City & Major Airport Hub',
      responseMinutes: 15,
      coordinates: { x: 52, y: 64 },
      availableCabs: 75,
      topRoutes: ['Airport Drops', 'To Rameswaram', 'To Sankarankovil', 'To Kodaikanal']
    },
    {
      id: 'tuticorin',
      name: 'Tuticorin (Thoothukudi)',
      district: 'Thoothukudi Dist',
      tagline: 'Pearl City & Port Airport Hub',
      responseMinutes: 15,
      coordinates: { x: 55, y: 83 },
      availableCabs: 30,
      topRoutes: ['To Tiruchendur', 'Airport Drops', 'To Tirunelveli']
    },
    {
      id: 'trichy',
      name: 'Trichy (Tiruchirappalli)',
      district: 'Trichy Dist',
      tagline: 'Central Tamil Nadu Hub',
      responseMinutes: 20,
      coordinates: { x: 62, y: 48 },
      availableCabs: 40,
      topRoutes: ['To Sankarankovil', 'To Chennai', 'To Thanjavur']
    },
    {
      id: 'coimbatore',
      name: 'Coimbatore',
      district: 'Coimbatore Dist',
      tagline: 'Kongu Belt & Ooty Connection',
      responseMinutes: 20,
      coordinates: { x: 30, y: 45 },
      availableCabs: 35,
      topRoutes: ['To Sankarankovil', 'To Palani', 'To Ooty Hills']
    },
    {
      id: 'chennai',
      name: 'Chennai',
      district: 'Chennai Metro',
      tagline: 'Capital Outstation Destination',
      responseMinutes: 25,
      coordinates: { x: 80, y: 18 },
      availableCabs: 50,
      topRoutes: ['To Tirunelveli', 'To Sankarankovil Return', 'To Madurai']
    }
  ];

  readonly testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Murugesan Pandian',
      nameTa: 'முருகேசன் பாண்டியன்',
      location: 'Sankarankovil',
      locationTa: 'சங்கரன்கோவில்',
      rating: 5,
      date: 'Recent Trip',
      dateTa: 'சமீபத்திய பயணம்',
      tripType: 'Temple Darshan & Madurai Airport',
      tripTypeTa: 'கோவில் தரிசனம் & மதுரை ஏர்போர்ட்',
      avatar: '👨‍💼',
      comment: 'Best taxi service in Sankarankovil! We booked an Innova for our family temple visit and Madurai airport drop. Driver Selvam was punctual, drove very safely, and the vehicle was spotless. Honest ₹14/km rate with no hidden charges.',
      commentTa: 'சங்கரன்கோவிலில் மிகச் சிறந்த டாக்ஸி சேவை! குடும்பத்துடன் கோவில் தரிசனம் மற்றும் மதுரை ஏர்போர்ட் செல்ல இனோவா புக் செய்தோம். ஓட்டுநர் செல்வம் சரியான நேரத்திற்கு வந்தார், மிகவும் பாதுகாப்பாக ஓட்டினார். வண்டி மிகத் தூய்மையாக இருந்தது. ₹14/கிமீ நியாயமான கட்டணம், கூடுதல் மறைமுக கட்டணம் எதுவும் இல்லை.'
    },
    {
      id: '2',
      name: 'Anitha Venkatesh',
      nameTa: 'அனிதா வெங்கடேஷ்',
      location: 'Chennai (Travelled to Sankarankovil)',
      locationTa: 'சென்னை (சங்கரன்கோவிலுக்கு பயணம்)',
      rating: 5,
      date: '1 week ago',
      dateTa: '1 வாரத்திற்கு முன்',
      tripType: 'Outstation Round Trip',
      tripTypeTa: 'வெளியூர் இருவழி பயணம்',
      avatar: '👩‍🏫',
      comment: 'Travelled from Chennai to Sankarankovil Gomathi Amman Temple festival. Rider Call Taxi provided a brand-new Swift Dzire. The driver was extremely polite, stopped at clean restaurants, and helped my elderly parents comfortably.',
      commentTa: 'சென்னையிலிருந்து சங்கரன்கோவில் கோமதி அம்மன் கோவில் திருவிழாவிற்கு வந்தோம். புதிய ஸ்விப்ட் டிசையர் வண்டி கொடுத்தார்கள். ஓட்டுநர் மிக மரியாதையாக நடந்து கொண்டார், வழியில் நல்ல உணவகங்களில் நிறுத்தினார். முதிய பெற்றோர்களுக்கு மிகவும் உதவியாக இருந்தார்.'
    },
    {
      id: '3',
      name: 'Dr. K. Rajasekaran',
      nameTa: 'டாக்டர் கே. ராஜசேகரன்',
      location: 'Tenkasi',
      locationTa: 'தென்காசி',
      rating: 5,
      date: '2 weeks ago',
      dateTa: '2 வாரங்களுக்கு முன்',
      tripType: 'Trivandrum Airport Drop',
      tripTypeTa: 'திருவனந்தபுரம் ஏர்போர்ட் டிராப்',
      avatar: '👨‍⚕️',
      comment: 'Needed an urgent 3 AM pickup from Tenkasi to catch a morning flight from Trivandrum. Rider Call Taxi confirmed within 2 minutes on WhatsApp and the cab arrived 15 minutes before time. Truly dependable 24/7 service!',
      commentTa: 'தென்காசியிலிருந்து அதிகாலை 3 மணிக்கு திருவனந்தபுரம் விமானம் பிடிக்க அவசர வண்டி தேவைப்பட்டது. வாட்ஸ்அப்பில் 2 நிமிடத்தில் புக் ஆனது. குறிப்பிட்ட நேரத்திற்கு 15 நிமிடம் முன்பே டாக்ஸி வந்துவிட்டது. 24/7 உண்மையிலேயே நம்பகமான சேவை!'
    },
    {
      id: '4',
      name: 'Sundararajan M.',
      nameTa: 'சுந்தரராஜன் எம்.',
      location: 'Rajapalayam',
      locationTa: 'ராஜபாளையம்',
      rating: 5,
      date: 'Last month',
      dateTa: 'கடந்த மாதம்',
      tripType: 'Wedding Convoy (3 Vehicles)',
      tripTypeTa: 'திருமண வாகன வரிசை (3 கார்கள்)',
      avatar: '🧔',
      comment: 'Booked 2 Innovas and 1 Tempo Traveller for our sister wedding in Rajapalayam. Coordination was seamless, drivers were verified and well dressed, and all guests were full of praise. Highly recommended!',
      commentTa: 'ராஜபாளையத்தில் என் தங்கை திருமணத்திற்கு 2 இனோவா மற்றும் 1 டெம்போ டிராவலர் புக் செய்தோம். சரியான திட்டமிடல், நல்ல ஆடைகளுடன் பண்பான ஓட்டுநர்கள். உறவினர்கள் அனைவரும் பாராட்டினர். மிகச் சிறந்த சேவை!'
    }
  ];

  // Live Fare Calculation Formula: Distance * BaseRate (₹14) with vehicle & trip modifiers
  calculateFare(distanceKm: number, vehicleId: string = 'hatchback', tripType: 'oneway' | 'round' = 'oneway'): FareBreakup {
    const vehicle = this.vehicleCategories.find(v => v.id === vehicleId) || this.vehicleCategories[0];
    const ratePerKm = vehicle.ratePerKm;
    const effectiveKm = tripType === 'round' ? distanceKm * 2 : distanceKm;
    
    // Formula: Distance * Rate
    const baseFare = Math.round(effectiveKm * ratePerKm);
    
    // Transparent driver allowance and toll estimate
    const driverAllowance = effectiveKm > 250 ? 400 : (effectiveKm > 100 ? 250 : 0);
    const estimatedToll = effectiveKm > 80 ? Math.round(effectiveKm * 1.1) : 0;
    const estimatedTotal = baseFare + driverAllowance + estimatedToll;

    return {
      distanceKm: effectiveKm,
      ratePerKm,
      baseFare,
      driverAllowance,
      estimatedToll,
      estimatedTotal,
      vehicleName: vehicle.name,
      tripType: tripType === 'round' ? 'Round Trip' : 'One Way'
    };
  }

  // Pre-filled WhatsApp Enquiry Link Generator
  getWhatsAppEnquiryUrl(details: {
    name?: string;
    pickup?: string;
    destination?: string;
    date?: string;
    vehicle?: string;
    tripType?: string;
    estimatedFare?: number;
    distance?: number;
    message?: string;
  }): string {
    let text = `🚕 *NEW TAXI ENQUIRY - RIDER CALL TAXI*\n`;
    text += `📍 *Service Area:* Sankarankovil / Tamil Nadu\n`;
    text += `------------------------------------\n`;
    if (details.name) text += `👤 *Customer Name:* ${details.name}\n`;
    if (details.pickup) text += `🛫 *Pickup Location:* ${details.pickup}\n`;
    if (details.destination) text += `🛬 *Drop Destination:* ${details.destination}\n`;
    if (details.tripType) text += `🔄 *Trip Type:* ${details.tripType}\n`;
    if (details.vehicle) text += `🚗 *Selected Vehicle:* ${details.vehicle}\n`;
    if (details.date) text += `📅 *Travel Date:* ${details.date}\n`;
    if (details.distance) text += `📏 *Est. Distance:* ${details.distance} KM\n`;
    if (details.estimatedFare) text += `💰 *Est. Fare:* ₹${details.estimatedFare} (@ ₹${this.baseRatePerKm}/KM)\n`;
    if (details.message) text += `📝 *Notes:* ${details.message}\n`;
    text += `------------------------------------\n`;
    text += `Please confirm cab availability and exact quote. Thank you!`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/${this.company.rawPhone1}?text=${encoded}`;
  }
}
