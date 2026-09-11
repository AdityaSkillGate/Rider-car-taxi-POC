import { Component, OnInit, signal, computed, effect, untracked, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { SpeechService } from '../../shared/services/speech.service';
import { TranslationService } from '../../shared/services/translation.service';
import { ChatMessage } from '../../shared/models/taxi.model';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  public taxiData = inject(TaxiDataService);
  public speech = inject(SpeechService);
  public i18n = inject(TranslationService);

  isOpen = signal<boolean>(false);
  userInput = signal<string>('');
  messages = signal<ChatMessage[]>([]);
  isTyping = signal<boolean>(false);

  quickQueries = computed(() => {
    if (this.i18n.isTamil()) {
      return [
        { label: '💰 கட்டண விவரம்', query: 'ஒரு கிலோமீட்டருக்கு கட்டணம் எவ்வளவு?' },
        { label: '✈️ மதுரை ஏர்போர்ட்', query: 'மதுரை விமான நிலையத்திற்கு டாக்ஸி கட்டணம் என்ன?' },
        { label: '🛕 கோவில் சுற்றுலா', query: 'கோவில் சுற்றுலா தொகுப்புகள் பற்றி கூறுங்கள்' },
        { label: '🚗 இனோவா / 7 சீட்டர்', query: '7 சீட்டர் இனோவா கார் கிடைக்குமா?' },
        { label: '📞 ஓட்டுநர் உதவி மையம்', query: 'கட்டுப்பாட்டு அறையை எப்படி தொடர்பு கொள்வது?' }
      ];
    }
    return [
      { label: '💰 Fare per KM', query: 'What is your taxi rate per KM?' },
      { label: '✈️ Madurai Airport', query: 'How much is taxi to Madurai Airport?' },
      { label: '🛕 Temple Packages', query: 'Tell me about Temple Tour packages' },
      { label: '🚗 Innova / SUV', query: 'Do you have 7 seater Innova cabs?' },
      { label: '📞 Talk to Driver Desk', query: 'How to contact driver desk?' }
    ];
  });

  constructor() {
    // React to language switch to update welcome message if user hasn't chatted yet
    effect(() => {
      const _ = this.i18n.currentLang();
      untracked(() => {
        if (this.messages().length <= 1) {
          this.messages.set([this.getWelcomeMessage()]);
        }
      });
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.messages.set([this.getWelcomeMessage()]);
  }

  getWelcomeMessage(): ChatMessage {
    if (this.i18n.isTamil()) {
      return {
        id: '1',
        sender: 'bot',
        text: 'வணக்கம்! நான் **ரைடர்பாட்**, சங்கரன்கோவில் ரைடர் கால் டாக்ஸியின் AI பயண உதவியாளர். 🚕\n\nஉங்கள் பயணத்திற்கு நான் எவ்வாறு உதவ முடியும்? தமிழில் அல்லது ஆங்கிலத்தில் தட்டச்சு செய்யலாம், அல்லது மைக் மூலம் பேசலாம்!',
        time: this.getCurrentTime(),
        actions: [
          { label: 'கட்டணம் கணக்கிடு', action: 'fare' },
          { label: 'வாட்ஸ்அப்பில் முன்பதிவு', action: 'whatsapp' }
        ]
      };
    }
    return {
      id: '1',
      sender: 'bot',
      text: 'வணக்கம் & Hello! I am **RiderBot**, your AI travel assistant at Rider Call Taxi Sankarankovil. 🚕\n\nHow can I help your journey today? You can type in English or Tanglish, or tap the mic icon to speak!',
      time: this.getCurrentTime(),
      actions: [
        { label: 'Calculate Fare', action: 'fare' },
        { label: 'Book on WhatsApp', action: 'whatsapp' }
      ]
    };
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen.update(v => !v);
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  sendMessage(text?: string): void {
    const query = (text || this.userInput()).trim();
    if (!query) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: this.getCurrentTime()
    };

    this.messages.update(m => [...m, userMsg]);
    this.userInput.set('');
    this.isTyping.set(true);

    // Simulate AI response logic
    setTimeout(() => {
      const response = this.generateBotResponse(query);
      this.messages.update(m => [...m, response]);
      this.isTyping.set(false);
    }, 700);
  }

  generateBotResponse(query: string): ChatMessage {
    const q = query.toLowerCase();
    const time = this.getCurrentTime();
    const isTa = this.i18n.isTamil();

    if (q.includes('fare') || q.includes('rate') || q.includes('price') || q.includes('evalo') || q.includes('cost') || q.includes('km') || q.includes('கட்டணம்') || q.includes('விலை') || q.includes('ரூபாய்')) {
      if (isTa) {
        return {
          id: Date.now().toString(),
          sender: 'bot',
          text: `🚕 **வெளிப்படையான கட்டண முறை:**\n- **அடிப்படை கட்டணம்:** **₹14 / கி.மீ** (ஹேட்ச்பேக்)\n- **செடான் (டிசையர்/எட்டியோஸ்):** **₹15 / கி.மீ**\n- **எஸ்யூவி (இனோவா 7-சீட்டர்):** **₹19 / கி.மீ**\n- **டெம்போ டிராவலர் (14-சீட்டர்):** **₹24 / கி.மீ**\n\n✅ மறைமுக கட்டணங்கள் ஏதுமில்லை. சுங்கச்சாவடி ரசீது படி. 24/7 சரியான நேரத்தில் பிக்கப் உத்தரவாதம்!`,
          time,
          actions: [
            { label: 'வாட்ஸ்அப்பில் புக் செய்ய', action: 'whatsapp' }
          ]
        };
      }
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `🚕 **Transparent Fare Structure:**\n- **Base Rate:** **₹14 / KM** (Hatchback)\n- **Sedan (Dzire/Etios):** **₹15 / KM**\n- **SUV (Innova 7-Seater):** **₹19 / KM**\n- **Tempo Traveller (14-Seater):** **₹24 / KM**\n\n✅ Zero hidden fees. Fastag & Tolls as actuals. 24/7 on-time pickup guaranteed!`,
        time,
        actions: [
          { label: 'Open WhatsApp Booking', action: 'whatsapp' }
        ]
      };
    }

    if (q.includes('airport') || q.includes('madurai') || q.includes('trivandrum') || q.includes('tuticorin') || q.includes('flight') || q.includes('விமானம்') || q.includes('ஏர்போர்ட்')) {
      if (isTa) {
        return {
          id: Date.now().toString(),
          sender: 'bot',
          text: `✈️ **சங்கரன்கோவில் & தென்காசியில் இருந்து 24/7 ஏர்போர்ட் டிராப்:**\n\n• **மதுரை விமான நிலையம் (120 கி.மீ):** ~2 மணி 15 நிமிடம் (தோராயம் ₹1,680+)\n• **தூத்துக்குடி விமான நிலையம் (95 கி.மீ):** ~2 மணி நேரம்\n• **திருவனந்தபுரம் விமான நிலையம் (130 கி.மீ):** ~3 மணி நேரம்\n\nவிமான கண்காணிப்பு, வீட்டு வாசலில் பிக்கப் மற்றும் அதிகாலை 2 AM / 3 AM பிக்கப் வசதி!`,
          time,
          actions: [
            { label: 'ஏர்போர்ட் டாக்ஸி புக் செய்ய', action: 'whatsapp' }
          ]
        };
      }
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `✈️ **24/7 Airport Transfers from Sankarankovil & Tenkasi:**\n\n• **Madurai Airport (120 KM):** ~2 hrs 15 mins (Est. ₹1,680+)\n• **Tuticorin Airport (95 KM):** ~2 hrs\n• **Trivandrum Airport (130 KM):** ~3 hrs\n\nWe provide flight tracking, doorstep pickup, and early morning 2 AM/3 AM pickups without failure!`,
        time,
        actions: [
          { label: 'Book Airport Drop on WhatsApp', action: 'whatsapp' }
        ]
      };
    }

    if (q.includes('temple') || q.includes('sankarankovil') || q.includes('tiruchendur') || q.includes('rameswaram') || q.includes('kovil') || q.includes('கோவில்') || q.includes('சுற்றுலா')) {
      if (isTa) {
        return {
          id: Date.now().toString(),
          sender: 'bot',
          text: `🛕 **தென் தமிழக ஆன்மீக சுற்றுலா தொகுப்புகள்:**\n\n1. **சங்கரநாராயண சுவாமி கோவில்** & நவத்திருப்பதி கோவில்கள்\n2. **திருச்செந்தூர் முருகன் கோவில்** ஒரே நாள் தரிசனம்\n3. **மதுரை மீனாட்சி அம்மன் & ராமேஸ்வரம்** 2-நாள் பயணம்\n4. **குற்றாலம் & தென்காசி காசி விஸ்வநாதர்** சுற்றுலா\n\nகோவில் நடை திறக்கும் நேரங்களை நன்கு அறிந்த அனுபவமிக்க ஓட்டுநர்கள்!`,
          time,
          actions: [
            { label: 'கோவில் டூர் முன்பதிவு', action: 'whatsapp' }
          ]
        };
      }
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `🛕 **South Tamil Nadu Spiritual Temple Packages:**\n\n1. **Sankaranarayanaswamy Temple** local & surrounding navathirupathi tours\n2. **Tiruchendur Murugan Sea Temple** same-day darshan package\n3. **Madurai Meenakshi Amman Temple & Rameswaram** 2-day circuit\n4. **Courtallam & Tenkasi Kasi Viswanathar** heritage trip\n\nOur chauffeurs are familiar with temple timings, darshan queues, and parking spots!`,
        time,
        actions: [
          { label: 'Enquire Temple Package', action: 'whatsapp' }
        ]
      };
    }

    if (q.includes('innova') || q.includes('suv') || q.includes('tempo') || q.includes('fleet') || q.includes('car') || q.includes('family') || q.includes('கார்') || q.includes('வாகனம்') || q.includes('இனோவா')) {
      if (isTa) {
        return {
          id: Date.now().toString(),
          sender: 'bot',
          text: `🚗 **எங்கள் சுத்தமான ஏசி வாகனங்கள்:**\n\n• **ஹேட்ச்பேக் (4 சீட்டர்):** ஸ்விப்ட், வேகன்ஆர்\n• **செடான் (4 சீட்டர்):** ஸ்விப்ட் டிசையர், எட்டியோஸ் (Executive AC)\n• **எஸ்யூவி (7 சீட்டர்):** டொயோட்டா இனோவா & எர்டிகா (கேப்டன் இருக்கைகள்)\n• **டெம்போ டிராவலர் (14 சீட்டர்):** புஷ்பேக் சொகுசு இருக்கைகள் & LED திரை\n\nஅனைத்து கார்களிலும் GPS வசதி மற்றும் சரிபார்க்கப்பட்ட ஓட்டுநர்கள்.`,
          time,
          actions: [
            { label: 'வாகனம் புக் செய்ய', action: 'whatsapp' }
          ]
        };
      }
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `🚗 **Our Clean & Sanitized Fleet Available:**\n\n• **Hatchback (4 Seater):** Swift, WagonR\n• **Sedan (4 Seater):** Swift Dzire, Etios (Executive AC)\n• **SUV (7 Seater):** Toyota Innova & Ertiga (Captain Seats)\n• **Tempo Traveller (14 Seater):** Pushback luxury seats with LED screen\n\nAll vehicles are GPS monitored with verified drivers.`,
        time,
        actions: [
          { label: 'Check Availability on WhatsApp', action: 'whatsapp' }
        ]
      };
    }

    if (q.includes('contact') || q.includes('call') || q.includes('phone') || q.includes('number') || q.includes('address') || q.includes('office') || q.includes('தொடர்பு') || q.includes('எண்') || q.includes('அலுவலகம்')) {
      if (isTa) {
        return {
          id: Date.now().toString(),
          sender: 'bot',
          text: `📞 **ரைடர் கால் டாக்ஸி 24/7 தொடர்பு விவரம்:**\n\n• **அவசர உதவி எண்கள்:** +91 9363015586 / +91 9363715586\n• **மின்னஞ்சல்:** ridercalltaxi@gmail.com\n• **அலுவலக முகவரி:** 757A/7, MPM காம்ப்ளக்ஸ், ராஜபாளையம் மெயின் ரோடு, NGO காலனி, ஊராட்சி ஒன்றிய அலுவலகம் எதிரில், சங்கரன்கோவில் – 627756.`,
          time,
          actions: [
            { label: 'அழைக்க', action: 'call' },
            { label: 'வாட்ஸ்அப் சாட்', action: 'whatsapp' }
          ]
        };
      }
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `📞 **Rider Call Taxi 24/7 Desk:**\n\n• **Hotline:** +91 9363015586 / +91 9363715586\n• **Email:** ridercalltaxi@gmail.com\n• **Office:** 757A/7, First Floor, MPM Complex, Rajapalayam Main Road, NGO Colony Opp, Sankarankovil – 627756.`,
        time,
        actions: [
          { label: 'Call Driver Desk', action: 'call' },
          { label: 'Chat on WhatsApp', action: 'whatsapp' }
        ]
      };
    }

    // Default friendly fallback
    if (isTa) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `நிச்சயமாக! உடனடியாக கார் முன்பதிவு செய்ய சங்கரன்கோவில் ஓட்டுநர் கட்டுப்பாட்டு மேலாளருடன் வாட்ஸ்அப் அல்லது தொலைபேசி மூலம் இணைக்கவா?`,
        time,
        actions: [
          { label: 'வாட்ஸ்அப்பில் இணைக்க', action: 'whatsapp' },
          { label: 'அழைக்க +91 9363015586', action: 'call' }
        ]
      };
    }
    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: `Sure! I can instantly connect you with our 24/7 dispatch manager in Sankarankovil on WhatsApp or phone for immediate cab allocation. Would you like to connect right now?`,
      time,
      actions: [
        { label: 'Connect via WhatsApp', action: 'whatsapp' },
        { label: 'Call +91 9363015586', action: 'call' }
      ]
    };
  }

  handleAction(action: string): void {
    if (action === 'whatsapp') {
      const msg = this.i18n.isTamil() 
        ? 'வணக்கம் ரைடர் கால் டாக்ஸி, நான் ரைடர்பாட் மூலம் பேசுகிறேன். டாக்ஸி புக் செய்ய விரும்புகிறேன்.' 
        : 'Hello Rider Call Taxi, I was chatting with RiderBot and would like to confirm a booking.';
      window.open(this.taxiData.getWhatsAppEnquiryUrl({ message: msg }), '_blank');
    } else if (action === 'call') {
      window.location.href = `tel:${this.taxiData.company.phone1}`;
    } else if (action === 'fare') {
      this.sendMessage(this.i18n.isTamil() ? 'ஒரு கிலோமீட்டருக்கு கட்டணம் எவ்வளவு?' : 'What is your taxi rate per KM?');
    }
  }

  toggleVoice(): void {
    if (this.speech.isListening()) {
      this.speech.stopListening();
    } else {
      const speechLang = this.i18n.isTamil() ? 'ta-IN' : 'en-IN';
      this.speech.startListening(
        (transcript) => {
          this.userInput.set(transcript);
          this.sendMessage(transcript);
        },
        (err) => {
          console.error('Speech error:', err);
        },
        speechLang
      );
    }
  }
}
