import { Component } from '@angular/core';
import { BusyService } from '../_services/busy.service';
import { CommonModule } from '@angular/common';

/**
 * A standalone component that displays a loading spinner overlay.
 * Its visibility is controlled by the BusyService.
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule per direttive come *ngIf.
  templateUrl: './spinner.html',
  styleUrl: './spinner.css'
})
export class Spinner {
  /**
   * @param busyService The service that manages the application's busy state.
   * La visibilità del template HTML di questo componente è legata all'observable `isBusy$`.
   * Il costruttore inietta il BusyService e lo rende `public` in modo che possa essere
   * referenziato direttamente dal template HTML.
   */
  constructor(public busyService: BusyService) { }
}
