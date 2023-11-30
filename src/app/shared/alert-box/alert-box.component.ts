import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-box.component.html',
  styleUrl: './alert-box.component.css',
})
export class AlertBoxComponent {
  @Input() textMessage?: string = '';
  @Input() isError: boolean | null = false;

  onCloseAlert() {
    this.textMessage = '';
  }
}
