import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { TranslationService } from '../../shared/services/translation.service';
import { ServiceItem } from '../../shared/models/taxi.model';
import { ScrollAnimationService } from '../../shared/services/scroll-animation.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements AfterViewInit {
  public taxiData = inject(TaxiDataService);
  public i18n = inject(TranslationService);
  private scrollAnimation = inject(ScrollAnimationService);

  ngAfterViewInit(): void {
    this.scrollAnimation.initScrollAnimations();
  }

  bookService(service: ServiceItem): void {
    const msg = this.i18n.isTamil()
      ? `வணக்கம், நான் ${service.title} (${service.subtitle}) சேவைக்காக டாக்ஸி முன்பதிவு செய்ய விரும்புகிறேன். கட்டண விவரம் அனுப்புங்கள்.`
      : `Enquiry for ${service.title} (${service.subtitle}). Please send quote and availability.`;
    const url = this.taxiData.getWhatsAppEnquiryUrl({
      message: msg
    });
    window.open(url, '_blank');
  }
}
