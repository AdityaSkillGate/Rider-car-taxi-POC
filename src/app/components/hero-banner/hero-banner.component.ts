import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { TaxiDataService } from '../../shared/services/taxi-data.service';
import { TranslationService } from '../../shared/services/translation.service';

export interface LocationOption {
  id: string;
  nameEn: string;
  nameTa: string;
}

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.scss']
})
export class HeroBannerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('threeCanvasContainer', { static: false }) canvasContainer!: ElementRef<HTMLDivElement>;

  public taxiData = inject(TaxiDataService);
  public i18n = inject(TranslationService);

  // Dropdown Locations as requested
  readonly locations: LocationOption[] = [
    { id: 'sankarankovil', nameEn: 'Sankarankovil', nameTa: 'சங்கரன்கோவில்' },
    { id: 'tirunelveli', nameEn: 'Tirunelveli', nameTa: 'திருநெல்வேலி' },
    { id: 'kovilpatti', nameEn: 'Kovilpatti', nameTa: 'கோவில்பட்டி' },
    { id: 'karivalam', nameEn: 'Karivalam', nameTa: 'கரிவலம்' },
    { id: 'tenkasi', nameEn: 'Tenkasi', nameTa: 'தென்காசி' },
    { id: 'courtallam', nameEn: 'Courtallam', nameTa: 'குற்றாலம்' },
    { id: 'kanniyakumari', nameEn: 'Kanniyakumari', nameTa: 'கன்னியாகுமரி' },
    { id: 'madurai', nameEn: 'Madurai', nameTa: 'மதுரை' },
    { id: 'thiruvananthapuram', nameEn: 'Thiruvananthapuram', nameTa: 'திருவனந்தபுரம்' },
    { id: 'chennai', nameEn: 'Chennai', nameTa: 'சென்னை' },
    { id: 'others', nameEn: 'Others (Custom)', nameTa: 'மற்றவை (விருப்ப இடம்)' }
  ];

  // Accurate Highway Distance Matrix (in KM) between destinations
  private readonly distanceMatrix: Record<string, Record<string, number>> = {
    sankarankovil: {
      sankarankovil: 15,
      karivalam: 12,
      kovilpatti: 40,
      tenkasi: 42,
      courtallam: 48,
      tirunelveli: 56,
      madurai: 120,
      kanniyakumari: 140,
      thiruvananthapuram: 145,
      chennai: 615
    },
    tirunelveli: {
      sankarankovil: 56,
      karivalam: 65,
      kovilpatti: 58,
      tenkasi: 53,
      courtallam: 58,
      tirunelveli: 15,
      madurai: 160,
      kanniyakumari: 85,
      thiruvananthapuram: 140,
      chennai: 625
    },
    kovilpatti: {
      sankarankovil: 40,
      karivalam: 48,
      kovilpatti: 15,
      tenkasi: 78,
      courtallam: 84,
      tirunelveli: 58,
      madurai: 100,
      kanniyakumari: 145,
      thiruvananthapuram: 175,
      chennai: 580
    },
    karivalam: {
      sankarankovil: 12,
      karivalam: 15,
      kovilpatti: 48,
      tenkasi: 52,
      courtallam: 58,
      tirunelveli: 65,
      madurai: 115,
      kanniyakumari: 150,
      thiruvananthapuram: 155,
      chennai: 610
    },
    tenkasi: {
      sankarankovil: 42,
      karivalam: 52,
      kovilpatti: 78,
      tenkasi: 15,
      courtallam: 8,
      tirunelveli: 53,
      madurai: 160,
      kanniyakumari: 130,
      thiruvananthapuram: 105,
      chennai: 650
    },
    courtallam: {
      sankarankovil: 48,
      karivalam: 58,
      kovilpatti: 84,
      tenkasi: 8,
      courtallam: 15,
      tirunelveli: 58,
      madurai: 165,
      kanniyakumari: 135,
      thiruvananthapuram: 110,
      chennai: 655
    },
    kanniyakumari: {
      sankarankovil: 140,
      karivalam: 150,
      kovilpatti: 145,
      tenkasi: 130,
      courtallam: 135,
      tirunelveli: 85,
      kanniyakumari: 15,
      madurai: 245,
      thiruvananthapuram: 90,
      chennai: 710
    },
    madurai: {
      sankarankovil: 120,
      karivalam: 115,
      kovilpatti: 100,
      tenkasi: 160,
      courtallam: 165,
      tirunelveli: 160,
      kanniyakumari: 245,
      madurai: 15,
      thiruvananthapuram: 280,
      chennai: 460
    },
    thiruvananthapuram: {
      sankarankovil: 145,
      karivalam: 155,
      kovilpatti: 175,
      tenkasi: 105,
      courtallam: 110,
      tirunelveli: 140,
      kanniyakumari: 90,
      madurai: 280,
      thiruvananthapuram: 15,
      chennai: 760
    },
    chennai: {
      sankarankovil: 615,
      karivalam: 610,
      kovilpatti: 580,
      tenkasi: 650,
      courtallam: 655,
      tirunelveli: 625,
      kanniyakumari: 710,
      madurai: 460,
      thiruvananthapuram: 760,
      chennai: 25
    }
  };

  // Calculator State
  selectedPickupId = signal<string>('sankarankovil');
  selectedDropId = signal<string>('madurai');
  customPickupText = signal<string>('');
  customDropText = signal<string>('');

  distanceKm = signal<number>(120); // Default Sankarankovil -> Madurai = 120 KM
  selectedVehicleId = signal<string>('hatchback');
  tripType = signal<'oneway' | 'round'>('oneway');

  // Environment Toggles for 3D
  isNightMode = signal<boolean>(false);
  isRainMode = signal<boolean>(false);

  // Three.js instances
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId!: number;

  // 3D Objects
  private taxiGroup = new THREE.Group();
  private roadMesh!: THREE.Mesh;
  private roadTexture!: THREE.CanvasTexture;
  private wheels: THREE.Group[] = [];
  private frontWheelSteerGroupLeft = new THREE.Group();
  private frontWheelSteerGroupRight = new THREE.Group();
  private rainParticles!: THREE.Points;
  private headlights: THREE.SpotLight[] = [];
  private headlightMeshes: THREE.Mesh[] = [];
  private taillightMeshes: THREE.Mesh[] = [];
  private streetLampsGroup = new THREE.Group();
  private streetLightPoints: THREE.PointLight[] = [];
  private catEyesGroup = new THREE.Group();
  private ambientLight!: THREE.AmbientLight;
  private sunLight!: THREE.DirectionalLight;
  private cloudsGroup = new THREE.Group();
  private templeSilhouetteGroup = new THREE.Group();

  ngOnInit(): void {
    this.updateDistanceForSelectedLocations();
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && this.canvasContainer) {
      try {
        this.initThreeJs();
        this.animate();
      } catch (error) {
        console.error('Hero scene could not be initialized:', error);
      }
      window.addEventListener('resize', this.onWindowResize);
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onWindowResize);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  // Live Fare Calculation getter
  get calculatedFare() {
    return this.taxiData.calculateFare(
      this.distanceKm(),
      this.selectedVehicleId(),
      this.tripType()
    );
  }

  // Location Dropdown Change Handlers
  onPickupChange(id: string): void {
    this.selectedPickupId.set(id);
    this.updateDistanceForSelectedLocations();
  }

  onDropChange(id: string): void {
    this.selectedDropId.set(id);
    this.updateDistanceForSelectedLocations();
  }

  private updateDistanceForSelectedLocations(): void {
    const pickup = this.selectedPickupId();
    const drop = this.selectedDropId();

    if (pickup !== 'others' && drop !== 'others') {
      const pData = this.distanceMatrix[pickup];
      if (pData && pData[drop] !== undefined) {
        this.distanceKm.set(pData[drop]);
        return;
      }
    }
    // If not in matrix or "others" selected, keep or default to 50 KM
    if (this.distanceKm() <= 0) {
      this.distanceKm.set(50);
    }
  }

  updateDistance(km: number): void {
    this.distanceKm.set(Math.max(1, km));
  }

  setVehicle(id: string): void {
    this.selectedVehicleId.set(id);
  }

  setTripType(type: 'oneway' | 'round'): void {
    this.tripType.set(type);
  }

  toggleNightMode(): void {
    this.isNightMode.update(v => !v);
    this.applyLightingMode(this.isNightMode());
  }

  toggleRainMode(): void {
    this.isRainMode.update(v => !v);
    if (this.rainParticles) {
      this.rainParticles.visible = this.isRainMode();
    }
  }

  getPickupDisplayName(): string {
    if (this.selectedPickupId() === 'others') {
      return this.customPickupText().trim() || (this.i18n.isTamil() ? 'விருப்ப இடம்' : 'Custom Pickup');
    }
    const loc = this.locations.find(l => l.id === this.selectedPickupId());
    return loc ? (this.i18n.isTamil() ? loc.nameTa : loc.nameEn) : this.selectedPickupId();
  }

  getDropDisplayName(): string {
    if (this.selectedDropId() === 'others') {
      return this.customDropText().trim() || (this.i18n.isTamil() ? 'விருப்ப சேருமிடம்' : 'Custom Drop');
    }
    const loc = this.locations.find(l => l.id === this.selectedDropId());
    return loc ? (this.i18n.isTamil() ? loc.nameTa : loc.nameEn) : this.selectedDropId();
  }

  dispatchWhatsAppBooking(): void {
    const fare = this.calculatedFare;
    const pickup = this.getPickupDisplayName();
    const drop = this.getDropDisplayName();
    const isTa = this.i18n.isTamil();

    const tripLabel = fare.tripType;
    const msg = isTa
      ? `வணக்கம் ரைடர் கால் டாக்ஸி, ${tripLabel} பயண முன்பதிவு விவரம்:\n📍 புறப்படும் இடம்: ${pickup}\n🏁 சேரும் இடம்: ${drop}\n📏 பயண தூரம்: ${fare.distanceKm} கி.மீ\n🚗 வாகனம்: ${fare.vehicleName}\n💰 தோராய கட்டணம்: ₹${fare.estimatedTotal}. தயவுசெய்து கார் உறுதிப்படுத்தவும்.`
      : `Enquiry for ${tripLabel} from ${pickup} to ${drop}.\nDistance: ${fare.distanceKm} KM\nVehicle: ${fare.vehicleName}\nEstimated Fare: ₹${fare.estimatedTotal}. Please confirm availability.`;

    const url = this.taxiData.getWhatsAppEnquiryUrl({
      pickup,
      destination: drop,
      distance: fare.distanceKm,
      vehicle: fare.vehicleName,
      tripType: fare.tripType,
      estimatedFare: fare.estimatedTotal,
      message: msg
    });
    window.open(url, '_blank');
  }

  // --- THREE.JS SCENE INITIALIZATION ---
  private initThreeJs(): void {
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xF1F5F9);
    this.scene.fog = new THREE.FogExp2(0xF1F5F9, 0.012);

    // Camera: Elevated dynamic 3/4 highway chase perspective
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    this.camera.position.set(9.5, 4.8, 12.5);
    this.camera.lookAt(0, 1.2, 1.0);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    // Natural Indian Sunlight & Hemisphere Lighting
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
    this.scene.add(this.ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xE0F2FE, 0x334155, 0.6);
    this.scene.add(hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xFFF7ED, 1.8);
    this.sunLight.position.set(18, 25, 18);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 120;
    this.sunLight.shadow.camera.left = -25;
    this.sunLight.shadow.camera.right = 25;
    this.sunLight.shadow.camera.top = 25;
    this.sunLight.shadow.camera.bottom = -25;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Build Scene Elements
    this.buildInfiniteRoad();
    this.buildStreetLamps();
    this.buildCatEyes();
    this.buildTaxiModel();
    this.buildTempleSkyline();
    this.buildClouds();
    this.buildGpsPins();
    this.buildRainSystem();

    // Set initial lighting
    this.applyLightingMode(false);
  }

  // Texture Generator: Realistic Multi-Lane Asphalt Highway
  private createRoadTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // 1. Dark Asphalt surface with subtle aggregate grain
    ctx.fillStyle = '#18202F';
    ctx.fillRect(0, 0, 1024, 1024);

    // Asphalt noise
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 14;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // 2. Solid Outer Highway Shoulder Lines (White, 16px wide)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(36, 0, 16, 1024);
    ctx.fillRect(972, 0, 16, 1024);

    // 3. Center Double Yellow Highway Dividers (Solid Indian Highway standard)
    ctx.fillStyle = '#FFC107';
    ctx.fillRect(504, 0, 8, 1024);
    ctx.fillRect(518, 0, 8, 1024);

    // 4. Broken Lane Separators (Dashed White lines)
    ctx.fillStyle = '#F8FAFC';
    for (let y = 0; y < 1024; y += 128) {
      // Left lane divider
      ctx.fillRect(270, y + 20, 10, 72);
      // Right lane divider
      ctx.fillRect(746, y + 20, 10, 72);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 8);
    return tex;
  }

  // Texture Generator: Authentic Tamil Nadu Taxi Registration Plate ("TN 76 RIDER")
  private createLicensePlateTexture(text: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Yellow commercial taxi plate background
    ctx.fillStyle = '#FFC72C';
    ctx.fillRect(0, 0, 256, 64);

    // Black outer border
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 252, 60);

    // Blue IND stripe on left
    ctx.fillStyle = '#1D4ED8';
    ctx.fillRect(3, 3, 32, 58);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('IND', 19, 36);

    // Registration text
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 28px "Arial Black", "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, 148, 44);

    return new THREE.CanvasTexture(canvas);
  }

  // Texture Generator: Aerodynamic Rooftop Taxi Sign ("TAXI - RIDER")
  private createTaxiSignTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Taxi yellow backlit background
    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, 256, 128);

    // Red header band
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(0, 0, 256, 32);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RIDER CALL TAXI', 128, 22);

    // Bold "TAXI" in center
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 52px "Arial Black", sans-serif';
    ctx.fillText('TAXI', 128, 86);

    // City tag
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('SANKARANKOVIL', 128, 114);

    return new THREE.CanvasTexture(canvas);
  }

  // Texture Generator: Car Contact Drop Shadow (Ambient Occlusion ground contact)
  private createCarShadowTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
  }

  // 1. Build Multi-Lane Highway with Guardrails and Kerbs
  private buildInfiniteRoad(): void {
    this.roadTexture = this.createRoadTexture();

    // 4-Lane Asphalt Highway
    const roadGeo = new THREE.PlaneGeometry(18, 160);
    const roadMat = new THREE.MeshStandardMaterial({
      map: this.roadTexture,
      roughness: 0.75,
      metalness: 0.15
    });

    this.roadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.roadMesh.rotation.x = -Math.PI / 2;
    this.roadMesh.position.set(0, 0, 0);
    this.roadMesh.receiveShadow = true;
    this.scene.add(this.roadMesh);

    // Yellow & Black Striped Kerb Stones (Left and Right)
    const kerbGeo = new THREE.BoxGeometry(0.5, 0.25, 160);
    const kerbMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.7 });

    const leftKerb = new THREE.Mesh(kerbGeo, kerbMat);
    leftKerb.position.set(-9.25, 0.12, 0);
    leftKerb.receiveShadow = true;
    this.scene.add(leftKerb);

    const rightKerb = new THREE.Mesh(kerbGeo, kerbMat);
    rightKerb.position.set(9.25, 0.12, 0);
    rightKerb.receiveShadow = true;
    this.scene.add(rightKerb);

    // Steel Guardrails (W-beam crash barriers)
    const railMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.8, roughness: 0.3 });
    const postMat = new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.7, roughness: 0.4 });

    [-9.8, 9.8].forEach(xPos => {
      // Horizontal upper beam
      const railGeo = new THREE.BoxGeometry(0.12, 0.35, 160);
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(xPos, 0.75, 0);
      rail.castShadow = true;
      this.scene.add(rail);

      // Support posts every 6 units
      for (let z = -75; z <= 75; z += 6) {
        const postGeo = new THREE.BoxGeometry(0.15, 0.85, 0.15);
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(xPos, 0.42, z);
        post.castShadow = true;
        this.scene.add(post);
      }
    });

    // Outer Shoulder & Landscape
    const groundGeo = new THREE.PlaneGeometry(90, 160);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.95 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(0, -0.05, 0);
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
  }

  // 2. Highway Street Lamp Posts (Curved modern LED highway poles that advance past the car)
  private buildStreetLamps(): void {
    this.streetLampsGroup = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const headMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.4 });
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0xFEF08A,
      emissive: 0xFDE047,
      emissiveIntensity: 0.8
    });

    const lampZPositions = [-60, -35, -10, 15, 40, 65];

    lampZPositions.forEach(z => {
      const lamp = new THREE.Group();

      // Vertical pole
      const poleGeo = new THREE.CylinderGeometry(0.09, 0.14, 5.5, 12);
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(0, 2.75, 0);
      pole.castShadow = true;
      lamp.add(pole);

      // Curved cantilever arm extending over the road
      const armGeo = new THREE.CylinderGeometry(0.07, 0.08, 2.4, 10);
      const arm = new THREE.Mesh(armGeo, poleMat);
      arm.rotation.z = Math.PI / 3;
      arm.position.set(-0.9, 5.4, 0);
      lamp.add(arm);

      // LED Lamp Luminaire head
      const headGeo = new THREE.BoxGeometry(0.8, 0.15, 0.35);
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(-1.8, 5.85, 0);
      lamp.add(head);

      // Downward glowing LED emitter
      const ledGeo = new THREE.PlaneGeometry(0.7, 0.3);
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.rotation.x = Math.PI / 2;
      led.position.set(-1.8, 5.76, 0);
      lamp.add(led);

      // Night light point
      const pointLight = new THREE.PointLight(0xFEF08A, 0, 18, 1.2);
      pointLight.position.set(-1.8, 5.6, 0);
      lamp.add(pointLight);
      this.streetLightPoints.push(pointLight);

      lamp.position.set(10.2, 0, z);
      this.streetLampsGroup.add(lamp);
    });

    this.scene.add(this.streetLampsGroup);
  }

  // 3. Road Studs / Cat's Eyes (Reflective 3D studs along highway lane lines)
  private buildCatEyes(): void {
    this.catEyesGroup = new THREE.Group();
    const studMat = new THREE.MeshStandardMaterial({
      color: 0xFBBF24,
      emissive: 0xF59E0B,
      emissiveIntensity: 0.7,
      metalness: 0.9,
      roughness: 0.1
    });

    // Place studs every 5 units along center double yellow line
    for (let z = -70; z <= 70; z += 5) {
      const studGeo = new THREE.BoxGeometry(0.18, 0.07, 0.22);
      const stud = new THREE.Mesh(studGeo, studMat);
      stud.position.set(0, 0.04, z);
      this.catEyesGroup.add(stud);

      // Left lane stud
      const studLeft = new THREE.Mesh(studGeo, studMat);
      studLeft.position.set(-4.2, 0.04, z);
      this.catEyesGroup.add(studLeft);

      // Right lane stud
      const studRight = new THREE.Mesh(studGeo, studMat);
      studRight.position.set(4.2, 0.04, z);
      this.catEyesGroup.add(studRight);
    }

    this.scene.add(this.catEyesGroup);
  }

  // 4. High-Fidelity Realistic 3D Taxi (Real Sedan Car with Steering Wheels, Brakes, Lighting & Drop Shadow)
  private buildTaxiModel(): void {
    this.taxiGroup = new THREE.Group();

    // --- MATERIALS ---
    // Premium Gloss Taxi Yellow Paint (with realistic clearcoat reflection)
    const taxiPaintMat = new THREE.MeshStandardMaterial({
      color: 0xFFBA08,
      roughness: 0.2,
      metalness: 0.35,
      envMapIntensity: 1.2
    });

    // Dark Trim & Aerodynamic Rocker Panels
    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      roughness: 0.6,
      metalness: 0.2
    });

    // Mirror Chrome Accents
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xF8FAFC,
      roughness: 0.1,
      metalness: 0.95
    });

    // Tinted Automotive Glass with Gloss Reflections
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0A0F1D,
      roughness: 0.06,
      metalness: 0.92,
      transparent: true,
      opacity: 0.88
    });

    // Rubber Tyre Material
    const tyreMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.9,
      metalness: 0.05
    });

    // Machined Silver 5-Spoke Alloy Rim
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      roughness: 0.2,
      metalness: 0.92
    });

    // Steel Brake Disc Rotor
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x94A3B8,
      roughness: 0.3,
      metalness: 0.85
    });

    // Sports Red Brake Caliper
    const caliperMat = new THREE.MeshStandardMaterial({
      color: 0xDC2626,
      roughness: 0.25,
      metalness: 0.4
    });

    // Modern Full-Width Red LED Taillight Bar
    const taillightMat = new THREE.MeshStandardMaterial({
      color: 0xDC2626,
      emissive: 0xEF4444,
      emissiveIntensity: 1.5,
      roughness: 0.2
    });

    // --- 1. AMBIENT CONTACT DROP SHADOW ---
    const shadowGeo = new THREE.PlaneGeometry(3.6, 6.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: this.createCarShadowTexture(),
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const dropShadow = new THREE.Mesh(shadowGeo, shadowMat);
    dropShadow.rotation.x = -Math.PI / 2;
    dropShadow.position.set(0, 0.03, 0);
    this.taxiGroup.add(dropShadow);

    // --- 2. LOWER CHASSIS & AERODYNAMIC BODY ---
    // Main lower body
    const lowerBodyGeo = new THREE.BoxGeometry(2.32, 0.55, 4.9);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, taxiPaintMat);
    lowerBody.position.set(0, 0.78, 0);
    lowerBody.castShadow = true;
    lowerBody.receiveShadow = true;
    this.taxiGroup.add(lowerBody);

    // Aerodynamic Dark Side Rocker Panels / Skirts
    const skirtGeo = new THREE.BoxGeometry(2.36, 0.16, 4.8);
    const skirt = new THREE.Mesh(skirtGeo, darkTrimMat);
    skirt.position.set(0, 0.52, 0);
    this.taxiGroup.add(skirt);

    // Sculpted Front Hood (Bonnet) with Aerodynamic Rake
    const hoodGeo = new THREE.BoxGeometry(2.26, 0.26, 1.55);
    const hood = new THREE.Mesh(hoodGeo, taxiPaintMat);
    hood.position.set(0, 1.12, 1.35);
    hood.rotation.x = 0.05;
    hood.castShadow = true;
    this.taxiGroup.add(hood);

    // Front Nose & Grille Panel
    const noseGeo = new THREE.BoxGeometry(2.24, 0.42, 0.35);
    const nose = new THREE.Mesh(noseGeo, darkTrimMat);
    nose.position.set(0, 0.8, 2.45);
    this.taxiGroup.add(nose);

    // Chrome Radiator Grille Horizontal Slats & Badge
    const grilleGeo = new THREE.BoxGeometry(1.6, 0.22, 0.08);
    const grille = new THREE.Mesh(grilleGeo, chromeMat);
    grille.position.set(0, 0.85, 2.63);
    this.taxiGroup.add(grille);

    // Front Bumper Lower Chin Splitter
    const chinGeo = new THREE.BoxGeometry(2.34, 0.1, 0.5);
    const chin = new THREE.Mesh(chinGeo, darkTrimMat);
    chin.position.set(0, 0.48, 2.38);
    this.taxiGroup.add(chin);

    // --- 3. DUAL PROJECTOR HEADLIGHTS WITH LED DRL EYEBROWS ---
    const hlHousingGeo = new THREE.BoxGeometry(0.48, 0.22, 0.25);
    const hlMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      emissive: 0xFEF9C3,
      emissiveIntensity: 0.9,
      roughness: 0.1
    });

    [-0.88, 0.88].forEach(x => {
      const hl = new THREE.Mesh(hlHousingGeo, hlMat);
      hl.position.set(x, 0.95, 2.42);
      this.headlightMeshes.push(hl);
      this.taxiGroup.add(hl);

      // Projector Lens Bulb inside headlight
      const bulbGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const bulb = new THREE.Mesh(bulbGeo, chromeMat);
      bulb.position.set(x > 0 ? x - 0.1 : x + 0.1, 0.95, 2.52);
      this.taxiGroup.add(bulb);
    });

    // Night Spotlight Beams (Twin Projector Highway Beams)
    const spotLeft = new THREE.SpotLight(0xFFFBEB, 0, 45, Math.PI / 6.5, 0.45, 1.2);
    spotLeft.position.set(-0.88, 0.95, 2.5);
    spotLeft.target.position.set(-0.88, 0.1, 24);
    this.taxiGroup.add(spotLeft);
    this.taxiGroup.add(spotLeft.target);
    this.headlights.push(spotLeft);

    const spotRight = new THREE.SpotLight(0xFFFBEB, 0, 45, Math.PI / 6.5, 0.45, 1.2);
    spotRight.position.set(0.88, 0.95, 2.5);
    spotRight.target.position.set(0.88, 0.1, 24);
    this.taxiGroup.add(spotRight);
    this.taxiGroup.add(spotRight.target);
    this.headlights.push(spotRight);

    // --- 4. CABIN GREENHOUSE, WINDSHIELD & PILLARS ---
    // Windshield (Raked front glass)
    const windshieldGeo = new THREE.BoxGeometry(2.08, 0.85, 0.1);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(0, 1.48, 0.58);
    windshield.rotation.x = -Math.PI / 3.8;
    this.taxiGroup.add(windshield);

    // Cabin Side & Rear Glass Block
    const cabinGeo = new THREE.BoxGeometry(2.04, 0.78, 2.3);
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(0, 1.5, -0.4);
    cabin.castShadow = true;
    this.taxiGroup.add(cabin);

    // Rear Windshield (Sloping into trunk)
    const rearGlassGeo = new THREE.BoxGeometry(2.0, 0.8, 0.1);
    const rearGlass = new THREE.Mesh(rearGlassGeo, glassMat);
    rearGlass.position.set(0, 1.46, -1.45);
    rearGlass.rotation.x = Math.PI / 3.8;
    this.taxiGroup.add(rearGlass);

    // Aerodynamic Curved Roof Top
    const roofGeo = new THREE.BoxGeometry(1.98, 0.12, 2.15);
    const roof = new THREE.Mesh(roofGeo, taxiPaintMat);
    roof.position.set(0, 1.9, -0.4);
    roof.castShadow = true;
    this.taxiGroup.add(roof);

    // Black A, B, C Roof Pillars
    const bPillarGeo = new THREE.BoxGeometry(2.08, 0.78, 0.12);
    const bPillar = new THREE.Mesh(bPillarGeo, darkTrimMat);
    bPillar.position.set(0, 1.5, -0.4);
    this.taxiGroup.add(bPillar);

    // --- 5. AERODYNAMIC SIDE WING MIRRORS WITH AMBER REPEATERS ---
    [-1.24, 1.24].forEach(x => {
      const mirrorArmGeo = new THREE.BoxGeometry(0.25, 0.08, 0.1);
      const mirrorArm = new THREE.Mesh(mirrorArmGeo, darkTrimMat);
      mirrorArm.position.set(x, 1.32, 0.7);
      this.taxiGroup.add(mirrorArm);

      const mirrorCapGeo = new THREE.BoxGeometry(0.24, 0.16, 0.18);
      const mirrorCap = new THREE.Mesh(mirrorCapGeo, taxiPaintMat);
      mirrorCap.position.set(x > 0 ? x + 0.12 : x - 0.12, 1.34, 0.7);
      mirrorCap.castShadow = true;
      this.taxiGroup.add(mirrorCap);

      // Amber side turn repeater strip
      const indicatorGeo = new THREE.BoxGeometry(0.05, 0.05, 0.12);
      const indicatorMat = new THREE.MeshStandardMaterial({
        color: 0xF59E0B,
        emissive: 0xD97706,
        emissiveIntensity: 0.8
      });
      const indicator = new THREE.Mesh(indicatorGeo, indicatorMat);
      indicator.position.set(x > 0 ? x + 0.22 : x - 0.22, 1.34, 0.7);
      this.taxiGroup.add(indicator);
    });

    // --- 6. CHROME DOOR HANDLES ---
    [
      { x: -1.18, z: 0.2 }, { x: -1.18, z: -0.7 },
      { x: 1.18, z: 0.2 }, { x: 1.18, z: -0.7 }
    ].forEach(h => {
      const handleGeo = new THREE.BoxGeometry(0.06, 0.05, 0.22);
      const handle = new THREE.Mesh(handleGeo, chromeMat);
      handle.position.set(h.x, 1.08, h.z);
      this.taxiGroup.add(handle);
    });

    // --- 7. REAR TRUNK, LIP SPOILER, CONNECTED LED TAILLIGHT BAR & EXHAUSTS ---
    // Sedan Trunk Lid
    const trunkGeo = new THREE.BoxGeometry(2.22, 0.28, 1.1);
    const trunk = new THREE.Mesh(trunkGeo, taxiPaintMat);
    trunk.position.set(0, 1.06, -1.9);
    trunk.castShadow = true;
    this.taxiGroup.add(trunk);

    // Integrated Aerodynamic Lip Spoiler
    const spoilerGeo = new THREE.BoxGeometry(2.18, 0.08, 0.2);
    const spoiler = new THREE.Mesh(spoilerGeo, darkTrimMat);
    spoiler.position.set(0, 1.22, -2.4);
    this.taxiGroup.add(spoiler);

    // Modern Connected LED Taillight Bar (Spanning entire rear width)
    const taillightGeo = new THREE.BoxGeometry(2.16, 0.16, 0.12);
    const taillight = new THREE.Mesh(taillightGeo, taillightMat);
    taillight.position.set(0, 0.98, -2.48);
    this.taillightMeshes.push(taillight);
    this.taxiGroup.add(taillight);

    // Rear Bumper Diffuser & Dual Stainless Steel Exhaust Pipes
    const diffuserGeo = new THREE.BoxGeometry(2.26, 0.28, 0.45);
    const diffuser = new THREE.Mesh(diffuserGeo, darkTrimMat);
    diffuser.position.set(0, 0.58, -2.35);
    this.taxiGroup.add(diffuser);

    [-0.65, 0.65].forEach(x => {
      const exhaustGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.25, 12);
      exhaustGeo.rotateX(Math.PI / 2);
      const exhaust = new THREE.Mesh(exhaustGeo, chromeMat);
      exhaust.position.set(x, 0.48, -2.55);
      this.taxiGroup.add(exhaust);
    });

    // --- 8. AUTHENTIC TAMIL NADU TAXI NUMBER PLATES ("TN 76 RIDER") ---
    const plateTex = this.createLicensePlateTexture('TN 76 RIDER');
    const plateMat = new THREE.MeshBasicMaterial({ map: plateTex });

    // Front Plate
    const frontPlateGeo = new THREE.PlaneGeometry(0.82, 0.2);
    const frontPlate = new THREE.Mesh(frontPlateGeo, plateMat);
    frontPlate.position.set(0, 0.64, 2.64);
    this.taxiGroup.add(frontPlate);

    // Rear Plate
    const rearPlateGeo = new THREE.PlaneGeometry(0.82, 0.2);
    const rearPlate = new THREE.Mesh(rearPlateGeo, plateMat);
    rearPlate.rotation.y = Math.PI;
    rearPlate.position.set(0, 0.76, -2.59);
    this.taxiGroup.add(rearPlate);

    // --- 9. STREAMLINED ROOFTOP TAXI LIGHT POD ("RIDER CALL TAXI") ---
    const signGeo = new THREE.BoxGeometry(1.05, 0.28, 0.46);
    const signMat = new THREE.MeshStandardMaterial({
      map: this.createTaxiSignTexture(),
      roughness: 0.2,
      emissive: 0xFDE047,
      emissiveIntensity: 0.5
    });
    const taxiSign = new THREE.Mesh(signGeo, signMat);
    taxiSign.position.set(0, 2.12, -0.3);
    taxiSign.castShadow = true;
    this.taxiGroup.add(taxiSign);

    // Aerodynamic mount feet
    [-0.38, 0.38].forEach(x => {
      const footGeo = new THREE.BoxGeometry(0.1, 0.08, 0.35);
      const foot = new THREE.Mesh(footGeo, darkTrimMat);
      foot.position.set(x, 1.97, -0.3);
      this.taxiGroup.add(foot);
    });

    // --- 10. REALISTIC SPORTS ALLOY WHEELS WITH BRAKE CALIPERS & STEERING PIVOTS ---
    const wheelPositions = [
      { id: 'FL', x: -1.22, y: 0.46, z: 1.48, isFront: true },
      { id: 'FR', x: 1.22, y: 0.46, z: 1.48, isFront: true },
      { id: 'RL', x: -1.22, y: 0.46, z: -1.48, isFront: false },
      { id: 'RR', x: 1.22, y: 0.46, z: -1.48, isFront: false }
    ];

    this.wheels = [];

    wheelPositions.forEach(pos => {
      const wheelAssembly = new THREE.Group();

      // Outer Rubber Tyre
      const tyreGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.34, 24);
      tyreGeo.rotateZ(Math.PI / 2);
      const tyre = new THREE.Mesh(tyreGeo, tyreMat);
      tyre.castShadow = true;
      wheelAssembly.add(tyre);

      // Machined Outer Rim lip
      const rimLipGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.35, 20);
      rimLipGeo.rotateZ(Math.PI / 2);
      const rimLip = new THREE.Mesh(rimLipGeo, rimMat);
      wheelAssembly.add(rimLip);

      // Ventilated Steel Brake Disc Rotor (inside rim)
      const discGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.04, 16);
      discGeo.rotateZ(Math.PI / 2);
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.position.x = pos.x > 0 ? -0.06 : 0.06;
      wheelAssembly.add(disc);

      // Red Sports Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.08, 0.16, 0.12);
      const caliper = new THREE.Mesh(caliperGeo, caliperMat);
      caliper.position.set(pos.x > 0 ? -0.06 : 0.06, 0.18, 0.08);
      wheelAssembly.add(caliper);

      // 5-Spoke Machined Alloy Wheel Face
      for (let s = 0; s < 5; s++) {
        const angle = (s * Math.PI * 2) / 5;
        const spokeGeo = new THREE.BoxGeometry(0.04, 0.3, 0.08);
        const spoke = new THREE.Mesh(spokeGeo, rimMat);
        spoke.rotation.x = angle;
        spoke.position.set(pos.x > 0 ? 0.15 : -0.15, Math.sin(angle) * 0.14, Math.cos(angle) * 0.14);
        wheelAssembly.add(spoke);
      }

      // Center Wheel Hub Cap with Yellow Accent
      const hubGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.36, 12);
      hubGeo.rotateZ(Math.PI / 2);
      const hub = new THREE.Mesh(hubGeo, chromeMat);
      wheelAssembly.add(hub);

      this.wheels.push(wheelAssembly);

      // Front wheels are placed inside steering groups for realistic driver steering animation
      if (pos.isFront) {
        if (pos.x < 0) {
          this.frontWheelSteerGroupLeft.position.set(pos.x, pos.y, pos.z);
          this.frontWheelSteerGroupLeft.add(wheelAssembly);
          this.taxiGroup.add(this.frontWheelSteerGroupLeft);
        } else {
          this.frontWheelSteerGroupRight.position.set(pos.x, pos.y, pos.z);
          this.frontWheelSteerGroupRight.add(wheelAssembly);
          this.taxiGroup.add(this.frontWheelSteerGroupRight);
        }
      } else {
        wheelAssembly.position.set(pos.x, pos.y, pos.z);
        this.taxiGroup.add(wheelAssembly);
      }
    });

    // Initial Taxi placement on the highway lane
    this.taxiGroup.position.set(0, 0, 1.8);
    this.scene.add(this.taxiGroup);
  }

  // 5. Sankarankovil Temple Gopuram Silhouette & Western Ghats Background
  private buildTempleSkyline(): void {
    this.templeSilhouetteGroup = new THREE.Group();
    const gopuramMat = new THREE.MeshStandardMaterial({
      color: 0x64748B,
      roughness: 0.85,
      transparent: true,
      opacity: 0.5
    });

    // Multi-tiered Sankarankovil Temple Gopuram
    const tiers = 7;
    for (let i = 0; i < tiers; i++) {
      const w = 11 - i * 1.25;
      const h = 2.1;
      const d = 4.0;
      const tierGeo = new THREE.BoxGeometry(w, h, d);
      const tier = new THREE.Mesh(tierGeo, gopuramMat);
      tier.position.set(-22, i * 2.15 + 1.2, -50);
      this.templeSilhouetteGroup.add(tier);
    }

    // Sacred Kalasams on top of Gopuram
    for (let k = -2; k <= 2; k++) {
      const kalasamGeo = new THREE.ConeGeometry(0.3, 1.6, 8);
      const kalasam = new THREE.Mesh(kalasamGeo, gopuramMat);
      kalasam.position.set(-22 + k * 0.95, tiers * 2.15 + 1.2, -50);
      this.templeSilhouetteGroup.add(kalasam);
    }

    // Distant Western Ghats Mountain Range
    for (let m = 0; m < 5; m++) {
      const mountainGeo = new THREE.ConeGeometry(20 + m * 4, 26, 7);
      const mountain = new THREE.Mesh(mountainGeo, gopuramMat);
      mountain.position.set(-50 + m * 24, 7, -65);
      this.templeSilhouetteGroup.add(mountain);
    }

    this.scene.add(this.templeSilhouetteGroup);
  }

  // 6. Sky Clouds
  private buildClouds(): void {
    this.cloudsGroup = new THREE.Group();
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.7 });

    for (let i = 0; i < 9; i++) {
      const cloudPuffGeo = new THREE.DodecahedronGeometry(2.8 + Math.random() * 2.2, 1);
      const puff = new THREE.Mesh(cloudPuffGeo, cloudMat);
      puff.position.set(
        (Math.random() - 0.5) * 70,
        15 + Math.random() * 8,
        -15 - Math.random() * 45
      );
      this.cloudsGroup.add(puff);
    }

    this.scene.add(this.cloudsGroup);
  }

  // 7. Floating GPS Waypoint Markers
  private buildGpsPins(): void {
    const pinsGroup = new THREE.Group();
    const pinGeo = new THREE.ConeGeometry(0.6, 1.4, 12);
    pinGeo.rotateX(Math.PI);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xD32F2F,
      emissive: 0xB71C1C,
      emissiveIntensity: 0.6
    });

    const locations = [
      { x: -5, z: -20 },
      { x: 5.5, z: -5 },
      { x: -5.2, z: 12 }
    ];

    locations.forEach(loc => {
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(loc.x, 3.8, loc.z);
      pinsGroup.add(pin);

      const sphereGeo = new THREE.SphereGeometry(0.42, 12, 12);
      const sphere = new THREE.Mesh(sphereGeo, pinMat);
      sphere.position.set(loc.x, 4.5, loc.z);
      pinsGroup.add(sphere);
    });

    this.scene.add(pinsGroup);
  }

  // 8. Rain Simulation System
  private buildRainSystem(): void {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = Math.random() * 35;
      positions[i + 2] = (Math.random() - 0.5) * 60;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x93C5FD,
      size: 0.16,
      transparent: true,
      opacity: 0.75
    });

    this.rainParticles = new THREE.Points(geometry, material);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);
  }

  // Day / Night Atmosphere Lighting
  private applyLightingMode(night: boolean): void {
    if (!this.scene) return;

    if (night) {
      this.scene.background = new THREE.Color(0x060911);
      this.scene.fog = new THREE.FogExp2(0x060911, 0.022);
      this.ambientLight.intensity = 0.25;
      this.sunLight.intensity = 0.2;
      this.sunLight.color.setHex(0x38BDF8);

      // Turn ON Street Lamps
      this.streetLightPoints.forEach(p => { p.intensity = 18; });

      // Turn ON Twin Projector Headlights
      this.headlights.forEach(hl => { hl.intensity = 32; });
      this.headlightMeshes.forEach(m => {
        (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.8;
      });
      this.taillightMeshes.forEach(m => {
        (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.2;
      });
    } else {
      this.scene.background = new THREE.Color(0xF1F5F9);
      this.scene.fog = new THREE.FogExp2(0xF1F5F9, 0.012);
      this.ambientLight.intensity = 1.2;
      this.sunLight.intensity = 1.8;
      this.sunLight.color.setHex(0xFFF7ED);

      // Turn OFF Street Lamps
      this.streetLightPoints.forEach(p => { p.intensity = 0; });

      // Daytime DRL Headlights
      this.headlights.forEach(hl => { hl.intensity = 0; });
      this.headlightMeshes.forEach(m => {
        (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
      });
      this.taillightMeshes.forEach(m => {
        (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0;
      });
    }
  }

  // Real Highway Driving Animation Loop (60 FPS)
  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const time = performance.now() * 0.001;

    // 1. Highway Road Surface Infinite Scroll
    if (this.roadTexture) {
      this.roadTexture.offset.y -= 0.052;
    }

    // 2. Wheel Spin (Synchronized with highway travel speed)
    this.wheels.forEach(wheel => {
      wheel.rotation.x -= 0.32;
    });

    // 3. Realistic Driving Physics: Subtle Highway Lane Cruising & Steering
    const laneOffset = Math.sin(time * 0.7) * 0.28;
    const steerAngle = Math.cos(time * 0.7) * 0.08;

    if (this.taxiGroup) {
      // Lateral position sway inside highway lane
      this.taxiGroup.position.x = laneOffset;

      // Realistic suspension micro-vibration & road bounce
      this.taxiGroup.position.y = Math.sin(time * 14) * 0.018 + Math.sin(time * 28) * 0.004;

      // Subtle chassis pitch during acceleration / cruising
      this.taxiGroup.rotation.x = Math.sin(time * 4) * 0.008;

      // Chassis roll into lane steering
      this.taxiGroup.rotation.z = -steerAngle * 0.35;
    }

    // Dynamic Front Wheel Steering matching the lane movement
    if (this.frontWheelSteerGroupLeft && this.frontWheelSteerGroupRight) {
      this.frontWheelSteerGroupLeft.rotation.y = steerAngle;
      this.frontWheelSteerGroupRight.rotation.y = steerAngle;
    }

    // 4. Highway Street Lamps Scrolling Past the Car
    if (this.streetLampsGroup) {
      this.streetLampsGroup.children.forEach(lamp => {
        lamp.position.z += 0.85;
        if (lamp.position.z > 70) {
          lamp.position.z = -75;
        }
      });
    }

    // 5. Cat's Eyes / Road Studs Scrolling
    if (this.catEyesGroup) {
      this.catEyesGroup.children.forEach(stud => {
        stud.position.z += 0.85;
        if (stud.position.z > 70) {
          stud.position.z = -70;
        }
      });
    }

    // 6. Sky Clouds Drifting
    if (this.cloudsGroup) {
      this.cloudsGroup.children.forEach(cloud => {
        cloud.position.x += 0.02;
        if (cloud.position.x > 40) {
          cloud.position.x = -40;
        }
      });
    }

    // 7. Monsoon Rain Physics
    if (this.rainParticles && this.isRainMode()) {
      const pos = this.rainParticles.geometry.attributes['position'].array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] -= 1.4; // Fall down
        pos[i + 2] += 0.45; // Streak backward relative to car speed
        if (pos[i + 1] < 0) {
          pos[i + 1] = 32;
        }
        if (pos[i + 2] > 30) {
          pos[i + 2] = -30;
        }
      }
      this.rainParticles.geometry.attributes['position'].needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  };

  private onWindowResize = (): void => {
    if (!this.canvasContainer || !this.renderer || !this.camera) return;
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };
}

