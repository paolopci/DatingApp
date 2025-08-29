import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service to manage the application's busy state, primarily for displaying a global loading spinner.
 */
@Injectable({
  providedIn: 'root'
})
export class BusyService {
  // Contatore per tenere traccia delle richieste "occupate" in corso.
  private busyRequestCount = 0;
  // BehaviorSubject per emettere lo stato di occupato/libero. Inizia con 'false' (non occupato).
  private busySource = new BehaviorSubject<boolean>(false);
  // Observable esposto pubblicamente per consentire ai componenti di sottoscrivere allo stato di occupato.
  isBusy$ = this.busySource.asObservable();

  constructor() { }

  /**
   * Called when a new task or HTTP request starts.
   * Increments the counter and emits 'true' to show the spinner.
   */
  busy(): void {
    this.busyRequestCount++;
    this.busySource.next(true); // Emette 'true' per indicare che l'app è occupata.
  }

  /**
   * Called when a task or HTTP request finishes.
   * Decrements the counter. If no more tasks are running, emits 'false' to hide the spinner.
   */
  idle(): void {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0; // Azzera per sicurezza.
      this.busySource.next(false); // Emette 'false' solo quando tutte le richieste sono completate.
    }
  }
}
