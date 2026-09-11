import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { TranslationService } from '../../shared/services/translation.service';

@Component({
  selector: 'app-mobile-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-bar.component.html',
  styleUrls: ['./mobile-bar.component.scss']
})
export class MobileBarComponent {
  public taxiData = inject(TaxiDataService);
  public i18n = inject(TranslationService);

  openWhatsApp(): void {
    const msg = this.i18n.isTamil()
      ? 'வணக்கம் ரைடர் கால் டாக்ஸி, நான் ஒரு டாக்ஸி முன்பதிவு செய்ய விரும்புகிறேன்.'
      : 'Hello Rider Call Taxi, I want to book a taxi from Sankarankovil / Tamil Nadu.';
    const url = this.taxiData.getWhatsAppEnquiryUrl({
      message: msg
    });
    window.open(url, '_blank');
  }

  scrollToCalculator(): void {
    const el = document.getElementById('fare-calculator-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
