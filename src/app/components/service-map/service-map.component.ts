import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { TranslationService } from '../../shared/services/translation.service';
import { CityCoverage } from '../../shared/models/taxi.model';

@Component({
  selector: 'app-service-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-map.component.html',
  styleUrls: ['./service-map.component.scss']
})
export class ServiceMapComponent {
  public taxiData = inject(TaxiDataService);
  public i18n = inject(TranslationService);

  selectedCityId = signal<string>('sankarankovil');

  get selectedCity(): CityCoverage {
    return this.taxiData.citiesCoverage.find(c => c.id === this.selectedCityId()) || this.taxiData.citiesCoverage[0];
  }

  selectCity(cityId: string): void {
    this.selectedCityId.set(cityId);
  }

  bookFromCity(city: CityCoverage): void {
    const isTa = this.i18n.isTamil();
    const msg = isTa
      ? `வணக்கம், சேவை வரைபடத்தில் பார்த்த ${city.name} (${city.district}) பகுதியில் இருந்து டாக்ஸி முன்பதிவு செய்ய விரும்புகிறேன். அருகில் உள்ள வாகனத்தை ஒதுக்கவும்.`
      : `Enquiry from Service Map for ${city.name} (${city.district}). Please assign the nearest available cab.`;
    const url = this.taxiData.getWhatsAppEnquiryUrl({
      pickup: city.name,
      message: msg
    });
    window.open(url, '_blank');
  }
}
