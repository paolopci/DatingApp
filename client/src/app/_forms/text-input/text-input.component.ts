import { CommonModule } from '@angular/common';
import { Component, input, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent {
  control = input.required<FormControl>();
  label = input<string>('');
  type = input<'text' | 'password' | 'email' | 'date' | 'number'>('text');
  id = input<string | undefined>(undefined);
  requiredMessage = input<string | null>(null);

  controlId = computed(() => {
    const base = (this.id() ?? this.label() ?? '').toString();
    return base.trim().toLowerCase().replace(/\s+/g, '-');
  });
}
