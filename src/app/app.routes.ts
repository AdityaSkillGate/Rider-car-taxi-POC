import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Rider Call Taxi – #1 Taxi Service in Sankarankovil & Tamil Nadu'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'About Us – Rider Call Taxi Sankarankovil'
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent),
    title: 'Taxi Services & Tour Packages – Rider Call Taxi'
  },
  {
    path: 'fleet',
    loadComponent: () => import('./pages/fleet/fleet.component').then(m => m.FleetComponent),
    title: '3D Fleet Showcase – Rider Call Taxi'
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent),
    title: 'Tariff & Rate Card – Rider Call Taxi (₹14/KM)'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact & Booking – Rider Call Taxi Sankarankovil'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
