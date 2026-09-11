import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { TranslationService } from '../../shared/services/translation.service';
import { ScrollAnimationService } from '../../shared/services/scroll-animation.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements AfterViewInit {
  public taxiData = inject(TaxiDataService);
  public i18n = inject(TranslationService);
  private scrollAnimation = inject(ScrollAnimationService);

  testKm = 100;
  testVehicle = 'hatchback';
  testTrip: 'oneway' | 'round' = 'oneway';

  ngAfterViewInit(): void {
    this.scrollAnimation.initScrollAnimations();
  }

  get liveFare() {
    return this.taxiData.calculateFare(this.testKm, this.testVehicle, this.testTrip);
  }

  bookQuote(): void {
    const fare = this.liveFare;
    const msg = this.i18n.isTamil()
      ? `வணக்கம், ${fare.tripType} (${fare.distanceKm} கி.மீ, ${fare.vehicleName}) = ₹${fare.estimatedTotal} தோராய கட்டணத்திற்கு டாக்ஸி முன்பதிவு செய்ய விரும்புகிறேன்.`
      : `Quote enquiry for ${fare.tripType} (${fare.distanceKm} KM, ${fare.vehicleName}) = ₹${fare.estimatedTotal}.`;
    const url = this.taxiData.getWhatsAppEnquiryUrl({
      distance: fare.distanceKm,
      vehicle: fare.vehicleName,
      tripType: fare.tripType,
      estimatedFare: fare.estimatedTotal,
      message: msg
    });
    window.open(url, '_blank');
  }
}
