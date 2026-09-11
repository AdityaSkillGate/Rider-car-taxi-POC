import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { ChatbotComponent } from './core/chatbot/chatbot.component';
import { MobileBarComponent } from './core/mobile-bar/mobile-bar.component';
import { PreloaderComponent } from './core/preloader/preloader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ChatbotComponent,
    MobileBarComponent,
    PreloaderComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = signal('Rider Call Taxi – Sankarankovil');
}
