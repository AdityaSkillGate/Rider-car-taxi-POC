import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { TranslationService } from '../../shared/services/translation.service';
import { VehicleCategory } from '../../shared/models/taxi.model';

export interface VehicleHotspot {
  id: string;
  icon: string;
  titleTa: string;
  titleEn: string;
  descTa: string;
  descEn: string;
  topPct: number;
  leftPct: number;
}

@Component({
  selector: 'app-fleet-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fleet-showcase.component.html',
  styleUrls: ['./fleet-showcase.component.scss']
})
export class FleetShowcaseComponent implements OnInit, OnDestroy {
  public taxiData = inject(TaxiDataService);
  public i18n = inject(TranslationService);

  activeVehicleCategory = signal<string>('sedan');
  viewMode = signal<'exterior' | 'interior' | 'video'>('exterior');
  rotationAngle = signal<number>(45); // 0 to 360 degrees
  isRotatingAuto = signal<boolean>(true);
  isZoomed = signal<boolean>(false);
  activeHotspotId = signal<string | null>(null);

  // Video player state
  isVideoPlaying = signal<boolean>(true);
  isVideoMuted = signal<boolean>(true);

  // Drag interaction tracking
  private isDragging = false;
  private startX = 0;
  private startAngle = 45;
  private animationFrameId: any = null;

  readonly hotspots: VehicleHotspot[] = [
    {
      id: 'boot',
      icon: '🧳',
      titleTa: 'விசாலமான டிக்கி / லக்கேஜ் இடம்',
      titleEn: 'Spacious Luggage Boot',
      descTa: '3 முதல் 5 பெரிய சூட்கேஸ்கள் எளிதில் வைக்கலாம். வெளியூர் பயணங்களுக்கு கூரை கேரியர் வசதியும் உண்டு.',
      descEn: 'Accommodates 3 to 5 large suitcases easily. Overhead carrier available for outstation tours.',
      topPct: 48,
      leftPct: 22
    },
    {
      id: 'ac',
      icon: '❄️',
      titleTa: 'குளிர்ந்த ஏசி வசதி',
      titleEn: 'Chilled Dual Air Conditioning',
      descTa: 'அனைத்து இருக்கைகளுக்கும் தனித்தனி ஏசி காற்று துவாரங்கள். கோடை வெயிலிலும் இதமான குளிர்ச்சி.',
      descEn: 'Individual AC blowers for all passenger rows, ensuring pleasant climate control in any season.',
      topPct: 34,
      leftPct: 52
    },
    {
      id: 'safety',
      icon: '🛡️',
      titleTa: 'அங்கீகரிக்கப்பட்ட சுற்றுலா அனுமதி & GPS',
      titleEn: 'Commercial Tourist Permit & GPS',
      descTa: 'அரசு அங்கீகாரம் பெற்ற மஞ்சள் நம்பர் பிளேட், வேகக் கட்டுப்பாடு மற்றும் நேரலை GPS கண்காணிப்பு.',
      descEn: 'Official TN commercial yellow plate, speed governor, Fastag, and 24/7 GPS tracking.',
      topPct: 56,
      leftPct: 78
    },
    {
      id: 'seats',
      icon: '✨',
      titleTa: 'சொகுசு குஷன் இருக்கைகள்',
      titleEn: 'Ergonomic Cushion Seating',
      descTa: 'நீண்ட தூர பயணங்களுக்கு தகுந்த சாய்வு வசதி கொண்ட பிரீமியம் லெதர் இருக்கைகள் மற்றும் கூடுதல் லெக்ரூம்.',
      descEn: 'Comfortable reclining seats with plush cushioning and generous legroom for relaxed travel.',
      topPct: 42,
      leftPct: 38
    }
  ];

  ngOnInit(): void {
    this.startAutoRotationLoop();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  get currentVehicle(): VehicleCategory {
    return this.taxiData.vehicleCategories.find(v => v.id === this.activeVehicleCategory()) || this.taxiData.vehicleCategories[1];
  }

  get activeHotspot(): VehicleHotspot | undefined {
    return this.hotspots.find(h => h.id === this.activeHotspotId());
  }

  // Angle human-readable description in Tamil and English
  angleDescription = computed(() => {
    const deg = Math.round(this.rotationAngle());
    const isTa = this.i18n.isTamil();

    if (deg >= 335 || deg < 25) {
      return isTa ? `${deg}° • முன்பக்கத் தோற்றம் (Front View)` : `${deg}° • Front View`;
    } else if (deg >= 25 && deg < 75) {
      return isTa ? `${deg}° • முன் முக்கால் தோற்றம் (Front 3/4 Quarter)` : `${deg}° • Front 3/4 Quarter`;
    } else if (deg >= 75 && deg < 115) {
      return isTa ? `${deg}° • முழு பக்கவாட்டுத் தோற்றம் (Side Profile)` : `${deg}° • Full Side Profile`;
    } else if (deg >= 115 && deg < 165) {
      return isTa ? `${deg}° • பின் முக்கால் தோற்றம் (Rear 3/4 Angle)` : `${deg}° • Rear 3/4 Angle`;
    } else if (deg >= 165 && deg < 210) {
      return isTa ? `${deg}° • பின்பக்க லக்கேஜ் தோற்றம் (Rear View & Boot)` : `${deg}° • Rear View & Boot`;
    } else if (deg >= 210 && deg < 255) {
      return isTa ? `${deg}° • இடது பின் தோற்றம் (Left Rear Profile)` : `${deg}° • Left Rear Profile`;
    } else if (deg >= 255 && deg < 295) {
      return isTa ? `${deg}° • ஓட்டுநர் பக்கவாட்டுத் தோற்றம் (Driver Side Profile)` : `${deg}° • Driver Side Profile`;
    } else {
      return isTa ? `${deg}° • இடது முன் தோற்றம் (Left Front Angle)` : `${deg}° • Left Front Angle`;
    }
  });

  // Calculate 3D perspective transform based on rotation angle
  get turntableTransform(): string {
    const angle = this.rotationAngle();
    const tilt = (Math.sin((angle * Math.PI) / 180) * 10).toFixed(1);
    const scale = this.isZoomed() ? 1.16 : 1.0;
    return `perspective(1200px) rotateY(${tilt}deg) scale(${scale})`;
  }

  // Calculate shadow skew based on angle
  get turntableShadow(): string {
    const angle = this.rotationAngle();
    const rad = (angle * Math.PI) / 180;
    const xOff = Math.sin(rad) * 20;
    const blur = 35 + Math.abs(Math.cos(rad)) * 15;
    return `${xOff.toFixed(0)}px 25px ${blur.toFixed(0)}px rgba(0, 0, 0, 0.65)`;
  }

  selectCategory(catId: string): void {
    this.activeVehicleCategory.set(catId);
    this.activeHotspotId.set(null);
    if (this.viewMode() === 'video' && !this.currentVehicle.videoUrl) {
      this.viewMode.set('exterior');
    }
  }

  setViewMode(mode: 'exterior' | 'interior' | 'video'): void {
    this.viewMode.set(mode);
    if (mode === 'interior' || mode === 'video') {
      this.isRotatingAuto.set(false);
      this.activeHotspotId.set(null);
    }
  }

  setPresetAngle(angle: number): void {
    this.rotationAngle.set(angle);
    this.isRotatingAuto.set(false);
  }

  toggleAutoRotation(): void {
    this.isRotatingAuto.update(v => !v);
  }

  toggleZoom(): void {
    this.isZoomed.update(v => !v);
  }

  toggleHotspot(id: string): void {
    this.activeHotspotId.update(curr => (curr === id ? null : id));
  }

  closeHotspot(): void {
    this.activeHotspotId.set(null);
  }

  onAngleSliderChange(val: any): void {
    this.rotationAngle.set(Number(val));
    this.isRotatingAuto.set(false);
  }

  // --- VIDEO CONTROLS ---
  toggleVideoPlay(video: HTMLVideoElement): void {
    if (!video) return;
    if (video.paused) {
      video.play();
      this.isVideoPlaying.set(true);
    } else {
      video.pause();
      this.isVideoPlaying.set(false);
    }
  }

  toggleVideoMute(video: HTMLVideoElement): void {
    if (!video) return;
    video.muted = !video.muted;
    this.isVideoMuted.set(video.muted);
  }

  toggleFullscreen(video: HTMLVideoElement): void {
    if (!video) return;
    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  // --- MOUSE DRAG ROTATION ---
  onMouseDown(e: MouseEvent): void {
    if (this.viewMode() !== 'exterior') return;
    this.isDragging = true;
    this.startX = e.clientX;
    this.startAngle = this.rotationAngle();
    this.isRotatingAuto.set(false);
  }

  onMouseMove(e: MouseEvent): void {
    if (!this.isDragging || this.viewMode() !== 'exterior') return;
    const deltaX = e.clientX - this.startX;
    let newAngle = (this.startAngle + deltaX * 0.6) % 360;
    if (newAngle < 0) newAngle += 360;
    this.rotationAngle.set(Math.round(newAngle));
  }

  onMouseUp(): void {
    this.isDragging = false;
  }

  // --- TOUCH DRAG ROTATION ---
  onTouchStart(e: TouchEvent): void {
    if (this.viewMode() !== 'exterior' || e.touches.length !== 1) return;
    this.isDragging = true;
    this.startX = e.touches[0].clientX;
    this.startAngle = this.rotationAngle();
    this.isRotatingAuto.set(false);
  }

  onTouchMove(e: TouchEvent): void {
    if (!this.isDragging || this.viewMode() !== 'exterior' || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - this.startX;
    let newAngle = (this.startAngle + deltaX * 0.7) % 360;
    if (newAngle < 0) newAngle += 360;
    this.rotationAngle.set(Math.round(newAngle));
  }

  onTouchEnd(): void {
    this.isDragging = false;
  }

  // Auto-rotation physics loop
  private startAutoRotationLoop(): void {
    const loop = () => {
      if (this.isRotatingAuto() && !this.isDragging && this.viewMode() === 'exterior') {
        this.rotationAngle.update(a => (a + 0.35) % 360);
      }
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  bookCurrentVehicle(): void {
    const v = this.currentVehicle;
    const isTa = this.i18n.isTamil();
    const msg = isTa
      ? `வணக்கம், 3D கேலரியில் பார்த்த உண்மையான ${v.name} (${v.models}) வாகனத்தை ₹${v.ratePerKm}/கி.மீ கட்டணத்தில் புக் செய்ய விரும்புகிறேன்.`
      : `Enquiry from 3D Fleet Showcase for original ${v.name} (${v.models}) at ₹${v.ratePerKm}/KM.`;
    const url = this.taxiData.getWhatsAppEnquiryUrl({
      vehicle: v.name,
      message: msg
    });
    window.open(url, '_blank');
  }
}
