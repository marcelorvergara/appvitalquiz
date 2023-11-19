import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-questions.component.html',
  styleUrl: './quiz-questions.component.css',
})
export class QuizQuestionsComponent {
  @Input() question: string = '';
}
