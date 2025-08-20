import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Toast } from '../_services/toast';

@Component({
  selector: 'app-toasts',
  imports: [CommonModule],
  standalone: true,
  styleUrl: './toasts.css',
  template: `
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    @for (toast of toasts(); track $index) {
      <div class="toast align-items-center border-0 show mb-2"
           [ngClass]="{
             'toast-success': toast.type === 'success',
             'toast-error': toast.type === 'error',
             'toast-info': toast.type === 'info'
           }">
        <div class="d-flex">
          <div class="toast-body">{{ toast.text }}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto"
                  (click)="dismiss(toast.text)"></button>
        </div>
      </div>
    }
  </div>
  `
})
export class Toasts {
  private toastService = inject(Toast);
  toasts = computed(() => this.toastService.toasts());

  dismiss(text: string) {
    this.toastService['remove'](text);
  }
}
