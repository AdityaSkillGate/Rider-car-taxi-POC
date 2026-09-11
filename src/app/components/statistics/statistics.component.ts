import { Component, OnInit, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { TranslationService } from '../../shared/services/translation.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  public i18n = inject(TranslationService);

  stats = [
    { id: 'stat1', target: 10000, suffix: '+', labelKey: 'stats.happyRiders', subKey: 'stats.happyRidersSub', icon: '🚕' },
    { id: 'stat2', target: 500, suffix: '+', labelKey: 'stats.drivers', subKey: 'stats.driversSub', icon: '👨‍✈️' },
    { id: 'stat3', target: 24, suffix: '/7', labelKey: 'stats.support', subKey: 'stats.supportSub', icon: '🕒' },
    { id: 'stat4', target: 4.9, suffix: '★', labelKey: 'stats.rating', subKey: 'stats.ratingSub', icon: '⭐', isDecimal: true }
  ];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.initCounters();
    }
  }

  private initCounters(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.stats.forEach(stat => {
            const el = document.getElementById(`counter-${stat.id}`);
            if (el) {
              const obj = { val: 0 };
              gsap.to(obj, {
                val: stat.target,
                duration: 2.2,
                ease: 'power2.out',
                onUpdate: () => {
                  if (stat.isDecimal) {
                    el.innerText = obj.val.toFixed(1);
                  } else {
                    el.innerText = Math.floor(obj.val).toLocaleString('en-IN');
                  }
                }
              });
            }
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(this.el.nativeElement);
  }
}
