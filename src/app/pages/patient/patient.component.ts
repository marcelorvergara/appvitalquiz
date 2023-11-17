import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizComponent } from '../../components/quiz/quiz.component';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, QuizComponent],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
})
export class PatientComponent {}
