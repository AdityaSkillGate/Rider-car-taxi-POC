import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { TranslationService } from '../../shared/services/translation.service';
import { SmartRoute } from '../../shared/models/taxi.model';

@Component({
  selector: 'app-route-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './route-showcase.component.html',
  styleUrls: ['./route-showcase.component.scss']
})
export class RouteShowcaseComponent {
  public taxiData = inject(TaxiDataService);
  public i18n = inject(TranslationService);

  activeRouteId = signal<string>('snk-madurai');

  get activeRoute(): SmartRoute {
    return this.taxiData.smartRoutes.find(r => r.id === this.activeRouteId()) || this.taxiData.smartRoutes[0];
  }

  selectRoute(id: string): void {
    this.activeRouteId.set(id);
  }

  bookRoute(route: SmartRoute): void {
    const isTa = this.i18n.isTamil();
    const msg = isTa
      ? `வணக்கம், ${route.from} முதல் ${route.to} வரை (${route.distanceKm} கி.மீ, ஆரம்ப கட்டணம் ₹${route.startingPrice}) வழித்தடத்திற்கான டாக்ஸி முன்பதிவு செய்ய விரும்புகிறேன்.`
      : `Enquiry for popular route: ${route.from} to ${route.to} (${route.distanceKm} KM, Est. ₹${route.startingPrice}).`;
    const url = this.taxiData.getWhatsAppEnquiryUrl({
      pickup: route.from,
      destination: route.to,
      distance: route.distanceKm,
      estimatedFare: route.startingPrice,
      message: msg
    });
    window.open(url, '_blank');
  }
}
