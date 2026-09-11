import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { TranslationService } from '../../shared/services/translation.service';

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent {
  public taxiData = inject(TaxiDataService);
  public i18n = inject(TranslationService);

  openDirections(): void {
    window.open(this.taxiData.company.googleMapsDirectionsUrl, '_blank');
  }
}
