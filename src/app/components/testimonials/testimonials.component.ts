import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { TranslationService } from '../../shared/services/translation.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  public taxiData = inject(TaxiDataService);
  public i18n = inject(TranslationService);
  currentIndex = signal<number>(0);

  next(): void {
    this.currentIndex.update(i => (i + 1) % this.taxiData.testimonials.length);
  }

  prev(): void {
    this.currentIndex.update(i => (i - 1 + this.taxiData.testimonials.length) % this.taxiData.testimonials.length);
  }

  setIndex(index: number): void {
    this.currentIndex.set(index);
  }
}
