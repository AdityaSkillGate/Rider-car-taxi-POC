import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { TranslationService } from '../../shared/services/translation.service';
import { VehicleCategory } from '../../shared/models/taxi.model';

@Component({
  selector: 'app-taxi-types',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './taxi-types.component.html',
  styleUrls: ['./taxi-types.component.scss']
})
export class TaxiTypesComponent {
  public taxiData = inject(TaxiDataService);
  public i18n = inject(TranslationService);

  bookCategory(vehicle: VehicleCategory): void {
    const isTa = this.i18n.isTamil();
    const msg = isTa
      ? `வணக்கம், நான் ${vehicle.name} (${vehicle.models}) வாகனத்தை ₹${vehicle.ratePerKm}/கி.மீ கட்டணத்தில் புக் செய்ய விரும்புகிறேன்.`
      : `I am interested in booking a ${vehicle.name} (${vehicle.models}) at ₹${vehicle.ratePerKm}/KM.`;
    const url = this.taxiData.getWhatsAppEnquiryUrl({
      vehicle: vehicle.name,
      message: msg
    });
    window.open(url, '_blank');
  }
}
