import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBannerComponent } from '../../components/hero-banner/hero-banner.component';
import { StatisticsComponent } from '../../components/statistics/statistics.component';
import { WhyChooseUsComponent } from '../../components/why-choose-us/why-choose-us.component';
import { TaxiTypesComponent } from '../../components/taxi-types/taxi-types.component';
import { FleetShowcaseComponent } from '../../components/fleet-showcase/fleet-showcase.component';
import { RouteShowcaseComponent } from '../../components/route-showcase/route-showcase.component';
import { ServiceMapComponent } from '../../components/service-map/service-map.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { EnquiryFormComponent } from '../../components/enquiry-form/enquiry-form.component';
import { GoogleMapComponent } from '../../components/google-map/google-map.component';
import { ScrollAnimationService } from '../../shared/services/scroll-animation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroBannerComponent,
    StatisticsComponent,
    WhyChooseUsComponent,
    TaxiTypesComponent,
    FleetShowcaseComponent,
    RouteShowcaseComponent,
    ServiceMapComponent,
    TestimonialsComponent,
    EnquiryFormComponent,
    GoogleMapComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  private scrollAnimation = inject(ScrollAnimationService);

  ngAfterViewInit(): void {
    this.scrollAnimation.initScrollAnimations();
  }
}
