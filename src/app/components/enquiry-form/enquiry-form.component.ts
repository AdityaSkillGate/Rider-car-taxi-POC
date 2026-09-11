import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import confetti from 'canvas-confetti';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { TranslationService } from '../../shared/services/translation.service';

@Component({
  selector: 'app-enquiry-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enquiry-form.component.html',
  styleUrls: ['./enquiry-form.component.scss']
})
export class EnquiryFormComponent {
  public taxiData = inject(TaxiDataService);
  public i18n = inject(TranslationService);

  // Form Model
  name = '';
  phone = '';
  pickup = 'Sankarankovil';
  destination = '';
  travelDate = '';
  vehicleType = 'Hatchback';
  tripType = 'One Way';
  message = '';

  isSubmitted = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.isSubmitting.set(true);

    // Celebrate with confetti
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Build prefilled WhatsApp message and redirect
    const url = this.taxiData.getWhatsAppEnquiryUrl({
      name: this.name,
      pickup: this.pickup,
      destination: this.destination,
      date: this.travelDate,
      vehicle: this.vehicleType,
      tripType: this.tripType,
      message: `Phone: ${this.phone}. Notes: ${this.message || 'None'}`
    });

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
      window.open(url, '_blank');
    }, 600);
  }

  resetForm(): void {
    this.isSubmitted.set(false);
    this.name = '';
    this.phone = '';
    this.destination = '';
    this.message = '';
  }
}
