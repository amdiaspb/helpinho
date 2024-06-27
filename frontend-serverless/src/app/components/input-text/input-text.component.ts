import { Component, input, model } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'input-text',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-text.component.html',
  styles: ':host { @apply flex flex-col gap-1 } .ng-invalid.ng-dirty{ border: 1px #FF6F6F solid }'
})
export class InputTextComponent {
  title = input<string>();
  inputType = input.required<string>();
  placeholder = input<string>('');
  hint = input<string>();
  control = input<any>();
}
