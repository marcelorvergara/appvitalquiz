import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-box.component.html',
  styleUrl: './alert-box.component.css',
})
export class AlertBoxComponent implements OnInit {
  @Input() textMessage: string = '';
  @Input() isError: boolean = false;

  onCloseAlert() {
    this.textMessage = '';
  }

  ngOnInit(): void {
    console.log(this.isError);
  }
}
