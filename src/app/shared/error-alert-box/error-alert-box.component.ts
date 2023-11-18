import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-alert-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-alert-box.component.html',
  styleUrl: './error-alert-box.component.css',
})
export class ErrorAlertBoxComponent {
  @Input() errorMessage: string = '';

  onCloseAlert() {
    this.errorMessage = '';
  }
}
