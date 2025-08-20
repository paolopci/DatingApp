import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../_models/ToastMessage ';

@Injectable({
  providedIn: 'root'
})
export class Toast {
  // stato dei toast attivi
  toasts = signal<ToastMessage[]>([]);

  show(text: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toasts.update(list => [...list, { text, type }]);
    // Rimuove il toast dopo 5 secondi
    setTimeout(() => {
      this.remove(text);
    }, 5000);
  }

  private remove(text: string) {
    this.toasts.update(list => list.filter(toast => toast.text !== text));
  }
}