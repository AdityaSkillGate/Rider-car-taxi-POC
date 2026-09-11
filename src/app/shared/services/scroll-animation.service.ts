import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {
  private router = inject(Router);
  private observer: IntersectionObserver | null = null;
  private isListeningToRouter = false;

  constructor() {
    this.setupRouteListener();
  }

  private setupRouteListener(): void {
    if (this.isListeningToRouter || typeof window === 'undefined') return;
    this.isListeningToRouter = true;

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const tree = this.router.parseUrl(event.urlAfterRedirects || event.url);
        const fragment = tree.fragment;

        if (fragment) {
          setTimeout(() => {
            this.scrollToSection(fragment);
          }, 150);
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }

        // Re-initialize animations on the newly mounted page
        setTimeout(() => {
          this.initScrollAnimations();
        }, 120);
      });
  }

  initScrollAnimations(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-animated');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    setTimeout(() => {
      this.observeCards();
    }, 100);
  }

  observeCards(): void {
    if (typeof document === 'undefined' || !this.observer) return;

    const selectors = [
      // Universal Glass Cards
      '.glass-card',
      // Home Cards
      '.service-card',
      '.route-card',
      '.stat-card',
      '.testimonial-card',
      '.feature-card',
      '.taxi-card',
      '.enquiry-card',
      '.enquiry-card-wrapper',
      '.map-info-card',
      '.fleet-specs-card',
      '.vehicle-pill',
      // About Page Cards
      '.brand-heritage-card',
      '.story-text-pane',
      '.safety-card',
      '.timeline-card',
      // Services Page Cards
      '.service-master-card',
      // Fleet Page Matrix
      '.table-responsive-wrapper',
      // Pricing Page Cards
      '.rate-card',
      '.estimator-box',
      // Contact Page Cards
      '.info-card',
      // Headers & Section Intros across all pages
      '.section-header',
      '.about-hero-content',
      '.services-hero-content',
      '.fleet-hero-content',
      '.pricing-hero-content',
      '.contact-hero-content'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    elements.forEach((el, index) => {
      if (!el.classList.contains('scroll-animated')) {
        el.classList.add('scroll-reveal-item');
        const staggerClass = `stagger-${(index % 4) + 1}`;
        el.classList.add(staggerClass);
        this.observer?.observe(el);
      }
    });
  }

  scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    if (typeof window === 'undefined') return;
    window.scrollTo({
      top: 0,
      behavior
    });
  }

  scrollToSection(sectionId: string): void {
    if (typeof document === 'undefined') return;
    const target = document.getElementById(sectionId);
    if (target) {
      const headerOffset = 85;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
