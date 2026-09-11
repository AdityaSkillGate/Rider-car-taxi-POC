import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'ta';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly LANG_KEY = 'rider_call_taxi_lang';
  
  // Current language signal, defaults to Tamil ('ta') or English ('en') based on stored preference
  currentLang = signal<Language>(this.getInitialLang());

  isTamil = computed(() => this.currentLang() === 'ta');
  isEnglish = computed(() => this.currentLang() === 'en');

  private getInitialLang(): Language {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(this.LANG_KEY) as Language;
      if (saved === 'ta' || saved === 'en') {
        return saved;
      }
    }
    return 'ta'; // Default to Tamil as requested
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.LANG_KEY, lang);
    }
  }

  toggleLanguage(): void {
    const next = this.currentLang() === 'ta' ? 'en' : 'ta';
    this.setLanguage(next);
  }

  // Translation lookup helper
  t(key: string): string {
    const lang = this.currentLang();
    const dictionary = this.translations[lang];
    if (dictionary && dictionary[key]) {
      return dictionary[key];
    }
    // Fallback to English
    return this.translations['en'][key] || key;
  }

  // Comprehensive Bilingual Dictionary
  private readonly translations: Record<Language, Record<string, string>> = {
    ta: {
      // Navbar
      'nav.home': 'முகப்பு',
      'nav.about': 'எங்களை பற்றி',
      'nav.services': 'சேவைகள்',
      'nav.fleet': 'வாகனங்கள்',
      'nav.pricing': 'கட்டண விவரம்',
      'nav.contact': 'தொடர்புக்கு',
      'nav.callCenter': '24/7 முன்பதிவு',
      'nav.bookEnquiry': 'முன்பதிவு செய்ய',
      'nav.tagline': 'சங்கரன்கோவில், தமிழ்நாடு',
      'nav.langToggle': 'English',

      // Hero Section
      'hero.badge': '#1 நம்பகமான கால் டாக்ஸி - சங்கரன்கோவில் & தமிழ்நாடு',
      'hero.title1': 'தமிழ்நாடு முழுவதும்',
      'hero.titleHighlight': 'மகிழ்ச்சியான பயணம்',
      'hero.title2': 'நம்பிக்கையுடன் பயணியுங்கள்',
      'hero.sub': 'உள்ளூர் பயணம், ஏர்போர்ட் டிராப், வெளியூர் பயணம், கார்ப்பரேட் போக்குவரத்து, ஆன்மீக கோவில் சுற்றுலா மற்றும் திருமண வாகன சேவைகள் - சிறந்த ஓட்டுநர்கள் மற்றும் நேர்மையான ₹14/கி.மீ கட்டணத்தில்.',
      'hero.bookBtn': 'முன்பதிவு செய்ய',
      'hero.callBtn': 'உடனே அழைக்க',
      'hero.trustRate': '1 கி.மீ = ₹14',
      'hero.trustRateSub': 'குறைந்த கட்டண உத்தரவாதம்',
      'hero.trustVerified': '100% சரிபார்க்கப்பட்ட',
      'hero.trustVerifiedSub': 'அங்கீகரிக்கப்பட்ட ஓட்டுநர்கள்',
      'hero.trustPickup': '10 நிமிட பிக்கப்',
      'hero.trustPickupSub': 'சங்கரன்கோவில் முழுவதும்',
      'hero.nightMode': '🌙 இரவு பயன்முறை',
      'hero.dayMode': '☀️ பகல் பயன்முறை',
      'hero.rainOn': '🌧️ மழை எஃபெக்ட்',
      'hero.clearSky': '🌤️ தெளிவான வானம்',

      // Fare Calculator
      'calc.tag': 'நேரடி கட்டண கணக்கீடு',
      'calc.title': 'கட்டண கால்குலேட்டர்',
      'calc.officialRate': 'அங்கீகரிக்கப்பட்ட கட்டணம்: 1 கி.மீ = ₹14',
      'calc.oneWay': 'ஒரு வழி பயணம் (One Way)',
      'calc.roundTrip': 'இரு வழி பயணம் (Round Trip)',
      'calc.selectCab': 'டாக்ஸி வகையை தேர்வு செய்க:',
      'calc.pickup': 'புறப்படும் இடம்',
      'calc.drop': 'சேரும் இடம்',
      'calc.distance': 'பயண தூரம்:',
      'calc.formula': 'கணக்கீடு:',
      'calc.estimated': 'தோராய கட்டணம்',
      'calc.includes': 'வாகனம், எரிபொருள் மற்றும் ஓட்டுநர் கட்டணம் உட்பட',
      'calc.whatsappBtn': 'வாட்ஸ்அப்பில் புக் செய்ய',

      // Statistics
      'stats.happyRiders': 'திருப்தியான பயணிகள்',
      'stats.happyRidersSub': 'தென் தமிழ்நாடு முழுவதும்',
      'stats.drivers': 'நம்பகமான ஓட்டுநர்கள்',
      'stats.driversSub': 'அரசு அங்கீகாரம் பெற்றவர்கள்',
      'stats.support': '24/7 சேவை ஆதரவு',
      'stats.supportSub': 'உடனடி வாகன வசதி',
      'stats.rating': 'வாடிக்கையாளர் மதிப்பீடு',
      'stats.ratingSub': '3,500+ திருப்திகர கருத்துகள்',

      // Why Choose Us
      'why.badge': 'ஏன் ரைடர் கால் டாக்ஸி?',
      'why.title': 'சங்கரன்கோவிலில் மிக நம்பகமான',
      'why.titleHighlight': 'கால் டாக்ஸி சேவை',
      'why.sub': 'தமிழ் பண்பாட்டு விருந்தோம்பலுடன் நவீன பாதுகாப்பு தொழில்நுட்பத்தை இணைத்து சிறந்த பயண அனுபவத்தை வழங்குகிறோம்.',
      'why.feat1Title': 'அனுபவமிக்க ஓட்டுநர்கள்',
      'why.feat1Desc': '100% காவல் துறை சரிபார்ப்பு பெற்ற, தென் தமிழக சாலைகளை நன்கு அறிந்த பண்பான ஓட்டுநர்கள்.',
      'why.feat1Badge': 'சரிபார்க்கப்பட்டவர்கள்',
      'why.feat2Title': 'குறைந்த நியாயமான கட்டணம்',
      'why.feat2Desc': '1 கி.மீ ₹14 முதல் தொடங்கும் வெளிப்படையான கட்டண முறை. கூடுதல் மறைமுக கட்டணங்கள் ஏதுமில்லை.',
      'why.feat2Badge': '₹14 / கி.மீ',
      'why.feat3Title': 'பாதுகாப்பான பயணம்',
      'why.feat3Desc': 'அனைத்து வாகனங்களிலும் GPS நேரடி கண்காணிப்பு வசதி மற்றும் 24 மணி நேர கட்டுப்பாட்டு அறை உதவி.',
      'why.feat3Badge': 'GPS நேரலை',
      'why.feat4Title': 'நேரத்திற்கு பிக்கப்',
      'why.feat4Desc': 'குறிப்பிட்ட நேரத்திற்கு உங்கள் வாசலில் வாகனம் தயார். தாமதமில்லா விமான & ரயில் பயணங்கள்.',
      'why.feat4Badge': 'தாமதமில்லை',
      'why.feat5Title': 'சுத்தமான ஏசி கார்கள்',
      'why.feat5Desc': 'ஒவ்வொரு பயணத்திற்கு முன்பும் தூய்மைப்படுத்தப்பட்ட, குளிர்சாதன வசதி கொண்ட புதிய கார்கள்.',
      'why.feat5Badge': 'தினசரி சுத்தம்',
      'why.feat6Title': '24/7 உடனடி சேவை',
      'why.feat6Desc': 'இரவு, பகல் எந்த நேரத்திலும் சங்கரன்கோவிலில் இருந்து அவசர டாக்ஸி முன்பதிவு வசதி.',
      'why.feat6Badge': 'எப்போதும் தயார்',

      // Taxi Categories
      'types.badge': 'டாக்ஸி வகைகள்',
      'types.title': 'உங்கள் பயணத்திற்கு ஏற்ற',
      'types.titleHighlight': 'சரியான வாகனத்தை தேர்வு செய்க',
      'types.sub': 'பட்ஜெட் ஹேட்ச்பேக் முதல் 14 பேர் செல்லக்கூடிய டெம்போ டிராவலர் வரை அனைத்து வாகனங்களும் ஏசி மற்றும் ஜிபிஎஸ் வசதியுடன்.',
      'types.bookBtn': 'முன்பதிவு செய்ய',

      // 3D Fleet Showcase
      'fleet.badge': '3D வாகன அரங்கம்',
      'fleet.title': 'எங்கள் வாகனங்களை',
      'fleet.titleHighlight': '360° முப்பரிமாணத்தில் காண்க',
      'fleet.sub': 'மவுஸ் மூலம் சுழற்றி வாகனத்தின் அழகை அனைத்து கோணங்களிலும் பார்த்து ரசியுங்கள். விளக்குகளை எரியவிட்டு, கதவுகளை திறந்து சோதிக்கலாம்.',
      'fleet.dragHint': '360° சுழற்ற மவுஸை நகர்த்தவும்',
      'fleet.pause360': 'சுழற்சியை நிறுத்து',
      'fleet.rotate360': '360° சுழற்று',
      'fleet.lightsOff': 'விளக்கை அணை',
      'fleet.lightsOn': 'விளக்கை எரிய விடு',
      'fleet.closeDoor': 'கதவை மூடு',
      'fleet.openDoor': 'கதவை திற',
      'fleet.normal': 'இயல்பு நிலை',
      'fleet.inspectLift': 'உயர்த்தி பார்',
      'fleet.seating': 'இருக்கைகள்',
      'fleet.luggage': 'லக்கேஜ் இடம்',
      'fleet.fuel': 'எரிபொருள் வகை',
      'fleet.comfort': 'பயண சௌகரியம்',
      'fleet.amenities': 'உள்ளடக்கிய வசதிகள்',
      'fleet.bookOnWa': 'வாட்ஸ்அப்பில் புக் செய்ய',

      // Smart Routes
      'routes.badge': 'பிரபலமான பயண வழித்தடங்கள்',
      'routes.title': 'முக்கிய நெடுஞ்சாலைகள் &',
      'routes.titleHighlight': 'வெளியூர் வழித்தடங்கள்',
      'routes.sub': 'சங்கரன்கோவிலில் இருந்து மதுரை விமான நிலையம், திருச்செந்தூர், சென்னை, தென்காசி வழித்தடங்களுக்கு நேரடி டாக்ஸி வசதி.',
      'routes.startingFrom': 'ஆரம்ப கட்டணம்',
      'routes.standardRate': '₹14/கி.மீ அடிப்படை கட்டணத்தில்',
      'routes.pickupHub': 'புறப்படும் இடம்',
      'routes.destination': 'சேரும் இடம்',
      'routes.enRoute': 'முக்கிய வழித்தட நிறுத்தங்கள்:',
      'routes.bookRouteBtn': 'இந்த வழித்தடத்தை புக் செய்ய',

      // Service Map
      'map.badge': 'சேவை மண்டலங்கள்',
      'map.title': 'தமிழ்நாடு சேவை வரைபடம் &',
      'map.titleHighlight': 'நேரடி டாக்ஸி நெட்வொர்க்',
      'map.sub': 'சங்கரன்கோவிலை தலைமையிடமாகக் கொண்டு தென்காசி, திருநெல்வேலி, மதுரை, சென்னை உள்ளிட்ட முக்கிய நகரங்களில் எங்கள் சேவை.',
      'map.mainHQ': 'சங்கரன்கோவில் தலைமை அலுவலகம்',
      'map.cityCluster': 'நகர டாக்ஸி மையம்',
      'map.avgPickup': 'சராசரி பிக்கப் நேரம்',
      'map.standbyCabs': 'தயார் நிலையில் வாகனங்கள்',
      'map.deskSupport': '24/7 சேவை உதவி',
      'map.popularFrom': 'பிரபலமான வழித்தடங்கள்:',
      'map.guaranteeTitle': 'ரைடர் கால் டாக்ஸியின் நேர தவறாமை உத்தரவாதம்',
      'map.guaranteeDesc': 'நீங்கள் குறிப்பிட்ட நேரத்திற்கு முன்பாகவே எங்கள் ஓட்டுநர் உங்கள் இருப்பிடத்திற்கு வந்து சேர்வார்.',
      'map.bookCityBtn': 'வாகனம் புக் செய்ய -',

      // Testimonials
      'reviews.badge': 'வாடிக்கையாளர் கருத்துகள்',
      'reviews.title': '10,000+ வாடிக்கையாளர்களின்',
      'reviews.titleHighlight': 'நம்பிக்கை பெற்ற பயணம்',
      'reviews.sub': 'எங்களுடன் பயணித்த வாடிக்கையாளர்களின் உண்மையான அனுபவங்கள் மற்றும் பாராட்டுக்கள்.',

      // Enquiry Form
      'form.badge': 'நேரடி முன்பதிவு மையம்',
      'form.title': '60 வினாடிகளில் உங்கள் டாக்ஸியை புக் செய்யுங்கள்',
      'form.desc': 'உங்கள் பயண விவரங்களை வாட்ஸ்அப்பில் அனுப்பவும். எங்கள் சங்கரன்கோவில் கட்டுப்பாட்டு அறை உடனடியாக வாகனத்தை உறுதி செய்யும்.',
      'form.perk1Title': 'வாட்ஸ்அப் உடனடி உறுதிப்படுத்தல்',
      'form.perk1Desc': 'வாகன எண் மற்றும் ஓட்டுநர் விவரங்கள் வாட்ஸ்அப்பில் பகிரப்படும்.',
      'form.perk2Title': 'நிலையான ₹14/கி.மீ கட்டணம்',
      'form.perk2Desc': 'மறைமுக கட்டணங்கள் இன்றி சரியான மீட்டரில் கட்டணம்.',
      'form.perk3Title': 'அவசர டாக்ஸி தேவையா?',
      'form.perk3Desc': 'உடனே அழைக்கவும்:',
      'form.fullName': 'முழு பெயர் *',
      'form.mobile': 'மொபைல் எண் (வாட்ஸ்அப்) *',
      'form.pickup': 'புறப்படும் இடம் *',
      'form.drop': 'சேரும் இடம் *',
      'form.date': 'பயண தேதி *',
      'form.vehicle': 'விரும்பும் வாகனம்',
      'form.notes': 'கூடுதல் குறிப்புகள் / நிபந்தனைகள் (விருப்பப்படி)',
      'form.submitBtn': 'வாட்ஸ்அப் மூலம் அனுப்ப',
      'form.connecting': 'இணைக்கப்படுகிறது...',
      'form.successTitle': 'முன்பதிவு கோரிக்கை அனுப்பப்பட்டது!',
      'form.successDesc': 'உங்கள் விவரங்கள் எங்கள் சங்கரன்கோவில் ஓட்டுநர் கட்டுப்பாட்டு மையத்திற்கு அனுப்பப்பட்டுள்ளது. விரைவில் தொடர்பு கொள்வோம்.',
      'form.bookAnother': 'மீண்டும் புக் செய்ய',

      // Google Map Office Section
      'mapSection.badge': 'எங்கள் அலுவலகம்',
      'mapSection.title': 'சங்கரன்கோவில் அலுவலகத்திற்கு',
      'mapSection.titleHighlight': 'நேரில் வருகை தருக',
      'mapSection.sub': 'ராஜபாளையம் மெயின் ரோடு, MPM காம்ப்ளக்ஸ், ஊராட்சி ஒன்றிய அலுவலகம் எதிரில் அமைந்துள்ளது.',
      'mapSection.addressLabel': 'அலுவலக முகவரி',
      'mapSection.hotlinesLabel': '24/7 அவசர உதவி எண்கள்',
      'mapSection.directionsBtn': 'வழித்தட வரைபடம்',

      // Footer
      'footer.ctaBadge': '24/7 சங்கரன்கோவில் டாக்ஸி மையம்',
      'footer.ctaTitle': 'சங்கரன்கோவிலில் அல்லது வெளியூருக்கு உடனடி டாக்ஸி தேவையா?',
      'footer.ctaSub': 'சுத்தமான ஏசி கார்கள், தகுதியான ஓட்டுநர்கள் மற்றும் ₹14/கி.மீ குறைந்த கட்டணத்தில். உடனே அழையுங்கள்!',
      'footer.callBtn': 'அழைக்க',
      'footer.waBtn': 'வாட்ஸ்அப் முன்பதிவு',
      'footer.desc': 'சங்கரன்கோவிலின் முதன்மையான 24/7 டாக்ஸி சேவை. தென் தமிழகத்தை அனைத்து விமான நிலையங்கள், கோவில்கள் மற்றும் பெருநகரங்களுடன் இணைக்கிறோம்.',
      'footer.quickNav': 'விரைவு இணைப்புகள்',
      'footer.servicesTitle': 'சேவைகள் & தொகுப்புகள்',
      'footer.officeTitle': 'தலைமை அலுவலகம்',
      'footer.rights': 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. சங்கரன்கோவில், தமிழ்நாடு.',

      // Mobile Bottom Bar
      'bar.directLine': 'நேரடி அழைப்பு',
      'bar.callNow': 'அழைக்க',
      'bar.instantQuote': 'கட்டண விவரம்',
      'bar.whatsApp': 'வாட்ஸ்அப்',

      // AI Chatbot
      'chat.triggerLabel': 'ரைடர்பாட் AI',
      'chat.botName': 'ரைடர்பாட் AI',
      'chat.sub': '24/7 பயண உதவியாளர் • தமிழ் & ஆங்கிலம்',
      'chat.placeholder': 'கட்டணம், வெளியூர், ஏர்போர்ட் டாக்ஸி பற்றி கேளுங்கள்...'
    },

    en: {
      // Navbar
      'nav.home': 'Home',
      'nav.about': 'About Us',
      'nav.services': 'Services',
      'nav.fleet': 'Fleet',
      'nav.pricing': 'Pricing & Rates',
      'nav.contact': 'Contact',
      'nav.callCenter': '24/7 Call Center',
      'nav.bookEnquiry': 'Book Enquiry',
      'nav.tagline': 'Sankarankovil, Tamil Nadu',
      'nav.langToggle': 'தமிழ்',

      // Hero Section
      'hero.badge': '#1 TAXI SERVICE IN SANKARANKOVIL & TAMIL NADU',
      'hero.title1': 'Ride Across',
      'hero.titleHighlight': 'Tamil Nadu',
      'hero.title2': 'With Comfort & Confidence',
      'hero.sub': 'Local Taxi, Airport Transfer, Outstation Travel, Corporate Transport, Temple Tourism and Wedding Transportation Services with verified drivers and fixed honest fares.',
      'hero.bookBtn': 'Book Enquiry',
      'hero.callBtn': 'Call Now',
      'hero.trustRate': '1 KM = ₹14',
      'hero.trustRateSub': 'Lowest Tariff Guaranteed',
      'hero.trustVerified': '100% Verified',
      'hero.trustVerifiedSub': 'Police-Checked Drivers',
      'hero.trustPickup': '10 Mins Pickup',
      'hero.trustPickupSub': 'Sankarankovil Wide',
      'hero.nightMode': '🌙 Night Mode',
      'hero.dayMode': '☀️ Day Mode',
      'hero.rainOn': '🌧️ Rain ON',
      'hero.clearSky': '🌤️ Clear Sky',

      // Fare Calculator
      'calc.tag': 'LIVE RATE ENGINE',
      'calc.title': 'Fare Calculator',
      'calc.officialRate': 'Official Standard: 1 KM = ₹14',
      'calc.oneWay': 'One Way Drop',
      'calc.roundTrip': 'Round Trip',
      'calc.selectCab': 'Select Cab Category:',
      'calc.pickup': 'Pickup Point',
      'calc.drop': 'Drop Destination',
      'calc.distance': 'Travel Distance:',
      'calc.formula': 'Formula:',
      'calc.estimated': 'Estimated Fare',
      'calc.includes': 'Includes Cab, Fuel & Chauffeur',
      'calc.whatsappBtn': 'Book On WhatsApp',

      // Statistics
      'stats.happyRiders': 'Happy Riders',
      'stats.happyRidersSub': 'Across South Tamil Nadu',
      'stats.drivers': 'Verified Drivers',
      'stats.driversSub': 'Police & Background Checked',
      'stats.support': 'Service Support',
      'stats.supportSub': 'Instant Dispatch Desk',
      'stats.rating': 'Customer Rating',
      'stats.ratingSub': 'Based on 3,500+ Reviews',

      // Why Choose Us
      'why.badge': 'WHY RIDER CALL TAXI',
      'why.title': 'The Most Trusted Ride in',
      'why.titleHighlight': 'Sankarankovil',
      'why.sub': 'We combine traditional Tamil hospitality with modern fleet technology, delivering a smooth, safe, and punctual journey every single mile.',
      'why.feat1Title': 'Professional Drivers',
      'why.feat1Desc': '100% verified, police background-checked chauffeurs with deep experience navigating South Tamil Nadu highways.',
      'why.feat1Badge': 'Police Verified',
      'why.feat2Title': 'Affordable Pricing',
      'why.feat2Desc': 'Transparent fare system starting at just ₹14/KM. Zero hidden charges, no surge rates, and honest kilometre billing.',
      'why.feat2Badge': '₹14 / KM',
      'why.feat3Title': 'Safe Journey',
      'why.feat3Desc': 'All vehicles equipped with real-time GPS tracking and 24/7 central desk monitoring for absolute passenger peace of mind.',
      'why.feat3Badge': 'Live GPS',
      'why.feat4Title': 'On-Time Pickup',
      'why.feat4Desc': 'Punctual door-step arrivals guaranteed. We value your flight and train schedules with our zero-delay promise.',
      'why.feat4Badge': 'Zero Delays',
      'why.feat5Title': 'Clean Vehicles',
      'why.feat5Desc': 'Immaculate, sanitized interiors with powerful dual air conditioning, plush seating, and spotless cabins on every ride.',
      'why.feat5Badge': 'Sanitized Daily',
      'why.feat6Title': '24/7 Availability',
      'why.feat6Desc': 'Round-the-clock emergency support and instant taxi dispatch from Sankarankovil, day or night, rain or shine.',
      'why.feat6Badge': 'Always On Call',

      // Taxi Categories
      'types.badge': 'FLEET CATEGORIES',
      'types.title': 'Choose the Perfect',
      'types.titleHighlight': 'Cab for Your Ride',
      'types.sub': 'From budget city hatchbacks to 14-seater luxury Tempo Travellers, our vehicles are clean, GPS monitored, and driven by courteous professionals.',
      'types.bookBtn': 'Book Now',

      // 3D Fleet Showcase
      'fleet.badge': '3D FLEET STUDIO',
      'fleet.title': 'Explore Our Cabs in',
      'fleet.titleHighlight': '360° 3D Interactive View',
      'fleet.sub': 'Click, drag, and inspect our modern, fully air-conditioned fleet. Switch models, test the headlights, and inspect door access.',
      'fleet.dragHint': 'Drag horizontally to rotate 360°',
      'fleet.pause360': 'Pause 360°',
      'fleet.rotate360': 'Rotate 360°',
      'fleet.lightsOff': 'Lights OFF',
      'fleet.lightsOn': 'Lights ON',
      'fleet.closeDoor': 'Close Door',
      'fleet.openDoor': 'Open Door',
      'fleet.normal': 'Normal',
      'fleet.inspectLift': 'Inspect Lift',
      'fleet.seating': 'Max Seating',
      'fleet.luggage': 'Luggage Space',
      'fleet.fuel': 'Fuel & Class',
      'fleet.comfort': 'Ride Comfort',
      'fleet.amenities': 'Included Amenities',
      'fleet.bookOnWa': 'Book on WhatsApp',

      // Smart Routes
      'routes.badge': 'POPULAR TRAVEL CIRCUITS',
      'routes.title': 'Smart Highways &',
      'routes.titleHighlight': 'Outstation Routes',
      'routes.sub': 'Direct non-stop cab transfers between Sankarankovil, Madurai Airport, Tiruchendur Temple, Tenkasi, and Chennai with transparent billing.',
      'routes.startingFrom': 'Starting From',
      'routes.standardRate': '@ ₹14/KM Standard Base',
      'routes.pickupHub': 'Pickup Hub',
      'routes.destination': 'Destination',
      'routes.enRoute': 'Route En-route Halts:',
      'routes.bookRouteBtn': 'Book This Route Now',

      // Service Map
      'map.badge': 'COVERAGE NETWORK',
      'map.title': 'Tamil Nadu',
      'map.titleHighlight': 'Service Map & Live Fleet',
      'map.sub': 'Headquartered at Sankarankovil with dedicated dispatch clusters across Tenkasi, Tirunelveli, Madurai, Chennai, and key transit hubs.',
      'map.mainHQ': 'Sankarankovil Main HQ',
      'map.cityCluster': 'City Fleet Cluster',
      'map.avgPickup': 'Avg. Pickup Time',
      'map.standbyCabs': 'Cabs on Standby',
      'map.deskSupport': '24/7 Desk Support',
      'map.popularFrom': 'Popular Routes from',
      'map.guaranteeTitle': 'Rider Call Taxi Punctuality Guarantee',
      'map.guaranteeDesc': 'Our driver will arrive at your specified pickup spot on time or as scheduled.',
      'map.bookCityBtn': 'Book Cab in',

      // Testimonials
      'reviews.badge': 'CUSTOMER STORIES',
      'reviews.title': 'Trusted by',
      'reviews.titleHighlight': '10,000+ Happy Riders',
      'reviews.sub': 'Read real experiences from local residents, pilgrims, airport travelers, and corporate clients across Tamil Nadu.',

      // Enquiry Form
      'form.badge': 'DIRECT BOOKING DESK',
      'form.title': 'Book Your Taxi in Under 60 Seconds',
      'form.desc': 'Submit your trip itinerary and our Sankarankovil operations manager will instantly verify driver availability and assign your cab.',
      'form.perk1Title': 'Instant WhatsApp Confirmation',
      'form.perk1Desc': 'Get cab number and driver phone details directly on WhatsApp.',
      'form.perk2Title': 'Fixed ₹14/KM Fare Model',
      'form.perk2Desc': 'Transparent metre and distance calculation with zero surge.',
      'form.perk3Title': 'Need an Immediate Cab?',
      'form.perk3Desc': 'Call our hotline right away:',
      'form.fullName': 'Full Name *',
      'form.mobile': 'Mobile Number (WhatsApp) *',
      'form.pickup': 'Pickup Location *',
      'form.drop': 'Drop Destination *',
      'form.date': 'Travel Date *',
      'form.vehicle': 'Vehicle Preferred',
      'form.notes': 'Special Instructions / Message (Optional)',
      'form.submitBtn': 'Send Enquiry via WhatsApp',
      'form.connecting': 'Connecting to Dispatch...',
      'form.successTitle': 'Enquiry Dispatched Successfully!',
      'form.successDesc': 'Your booking details have been forwarded to our 24/7 Sankarankovil driver control desk. We will confirm your cab shortly.',
      'form.bookAnother': 'Book Another Ride',

      // Google Map Office Section
      'mapSection.badge': 'FIND OUR OFFICE',
      'mapSection.title': 'Visit Our Sankarankovil',
      'mapSection.titleHighlight': 'Dispatch Office',
      'mapSection.sub': 'Conveniently located on Rajapalayam Main Road at MPM Complex, opposite the Panchayat Union Office.',
      'mapSection.addressLabel': 'OFFICE ADDRESS',
      'mapSection.hotlinesLabel': '24/7 HOTLINES',
      'mapSection.directionsBtn': 'Get Directions',

      // Footer
      'footer.ctaBadge': '24/7 SANKARANKOVIL DISPATCH',
      'footer.ctaTitle': 'Need an Instant Taxi in Sankarankovil or Outstation?',
      'footer.ctaSub': 'Verified drivers, clean sanitised cabs, and fair rates from ₹14/KM. Call us now!',
      'footer.callBtn': 'Call',
      'footer.waBtn': 'WhatsApp Quick Book',
      'footer.desc': "Sankarankovil's premier 24/7 taxi and tour service. We connect South Tamil Nadu to all major airports, temple destinations, and metro hubs with comfort, honesty, and safety.",
      'footer.quickNav': 'Quick Navigation',
      'footer.servicesTitle': 'Services & Packages',
      'footer.officeTitle': 'Head Office & Contact',
      'footer.rights': 'All rights reserved. Sankarankovil, Tamil Nadu.',

      // Mobile Bottom Bar
      'bar.directLine': 'Direct Line',
      'bar.callNow': 'Call Now',
      'bar.instantQuote': 'Instant Quote',
      'bar.whatsApp': 'WhatsApp',

      // AI Chatbot
      'chat.triggerLabel': 'RiderBot AI',
      'chat.botName': 'RiderBot AI',
      'chat.sub': '24/7 Smart Travel Assistant • Tamil & English',
      'chat.placeholder': 'Ask fare, outstation, airport cab...'
    }
  };
}
