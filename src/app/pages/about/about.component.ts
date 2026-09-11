import { Component, inject, computed, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { TranslationService } from '../../shared/services/translation.service';
import { ScrollAnimationService } from '../../shared/services/scroll-animation.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit {
  public taxiData = inject(TaxiDataService);
  public i18n = inject(TranslationService);
  private scrollAnimation = inject(ScrollAnimationService);

  ngAfterViewInit(): void {
    this.scrollAnimation.initScrollAnimations();
  }

  milestones = computed(() => {
    if (this.i18n.isTamil()) {
      return [
        { year: '2018', title: 'சங்கரன்கோவிலில் தொடக்கம்', desc: 'கோவில் பக்தர்கள் மற்றும் உள்ளூர் மக்களுக்காக நியாயமான கட்டணத்துடன் 5 கார்களுடன் தொடங்கப்பட்டது.' },
        { year: '2020', title: 'விமான நிலைய டாக்ஸி விரிவாக்கம்', desc: 'மதுரை, திருவனந்தபுரம், தூத்துக்குடி விமான நிலையங்களுக்கு 24/7 நேரடி டாக்ஸி சேவை தொடக்கம்.' },
        { year: '2022', title: '100% GPS நெட்வொர்க் & டிஜிட்டல் மையம்', desc: 'அனைத்து வாகனங்களிலும் நவீன GPS கண்காணிப்பு மற்றும் 24 மணி நேர கட்டுப்பாட்டு அறை வசதி.' },
        { year: '2024+', title: '10,000+ திருப்திகரமான பயணங்கள்', desc: 'செடான், எஸ்யூவி மற்றும் டெம்போ டிராவலர் உள்ளிட்ட 100+ வாகனங்களுடன் தமிழகம் முழுவதும் சேவை.' }
      ];
    }
    return [
      { year: '2018', title: 'Founded in Sankarankovil', desc: 'Started with 5 cabs to provide honest, meter-fair taxi service for temple pilgrims and local families.' },
      { year: '2020', title: 'Airport Transfers & Expansion', desc: 'Launched direct 24/7 airport connectivity to Madurai, Trivandrum, and Tuticorin.' },
      { year: '2022', title: '100% GPS Fleet & Digital Dispatch', desc: 'Equipped every single vehicle with high-precision GPS tracking and 24/7 central desk.' },
      { year: '2024+', title: '10,000+ Happy Journeys', desc: 'Expanded fleet to over 100+ vehicles covering Sedan, SUV, and Tempo Travellers across Tamil Nadu.' }
    ];
  });

  safetyStandards = computed(() => {
    if (this.i18n.isTamil()) {
      return [
        { icon: '🛡️', title: 'காவல்துறை சரிபார்க்கப்பட்ட ஓட்டுநர்கள்', desc: 'முழுமையான அடையாள சான்றிதழ், நன்னடத்தை மற்றும் ஓட்டுநர் உரிமம் சரிபார்க்கப்பட்டவர்கள்.' },
        { icon: '📡', title: 'நேரடி GPS கண்காணிப்பு', desc: 'ஒவ்வொரு பயணமும் சங்கரன்கோவில் கட்டுப்பாட்டு அறையிலிருந்து 24 மணி நேரமும் கண்காணிக்கப்படுகிறது.' },
        { icon: '🧹', title: 'ஒவ்வொரு பயணத்திற்குப் பின்னும் சுத்தம்', desc: 'முழுமையான தூய்மை, ஏசி வாசனை திரவியம் மற்றும் சுத்தமான இருக்கை வசதிகள்.' },
        { icon: '💰', title: 'கூடுதல் மறைமுக கட்டணங்கள் இல்லை', desc: '1 கி.மீ ₹14 என்ற நேர்மையான வெளிப்படையான கட்டணம் மற்றும் தெளிவான கட்டண ரசீதுகள்.' }
      ];
    }
    return [
      { icon: '🛡️', title: 'Police Verified Chauffeurs', desc: 'Complete identity, criminal record, and driving license background verification.' },
      { icon: '📡', title: 'Real-time GPS Monitoring', desc: 'Every trip tracked 24/7 from our Sankarankovil operations control room.' },
      { icon: '🧹', title: 'Sanitized After Every Trip', desc: 'Thorough cleaning, AC duct freshening, and clean upholstery.' },
      { icon: '💰', title: 'Zero Hidden Charges', desc: 'Honest transparent ₹14/KM rates with clear toll and parking receipts.' }
    ];
  });
}
