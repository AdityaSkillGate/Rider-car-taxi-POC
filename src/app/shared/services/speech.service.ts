import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  isListening = signal<boolean>(false);
  hasSupport = signal<boolean>(false);
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.hasSupport.set(true);
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-IN'; // English (India) with Tamil-English phonetic tuning
      }
    }
  }

  startListening(onResult: (transcript: string) => void, onError?: (err: any) => void, lang: string = 'ta-IN'): void {
    if (!this.recognition) return;

    this.recognition.lang = lang;
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.isListening.set(false);
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening.set(false);
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening.set(false);
    };

    try {
      this.isListening.set(true);
      this.recognition.start();
    } catch (e) {
      this.isListening.set(false);
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening()) {
      this.recognition.stop();
      this.isListening.set(false);
    }
  }
}
