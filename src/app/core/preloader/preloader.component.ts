import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent implements OnInit, OnDestroy {
  isLoading = signal<boolean>(true);
  progress = signal<number>(0);
  isFadingOut = signal<boolean>(false);
  private intervalId: any = null;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.progress.update(p => {
        if (p >= 100) {
          if (this.intervalId) clearInterval(this.intervalId);
          setTimeout(() => {
            this.isFadingOut.set(true);
            setTimeout(() => {
              this.isLoading.set(false);
            }, 400);
          }, 150);
          return 100;
        }
        return p + 10;
      });
    }, 35);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
