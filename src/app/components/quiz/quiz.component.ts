import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from './quiz.service';
import { QuizQuestionsComponent } from './quiz-questions/quiz-questions.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, QuizQuestionsComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent implements OnInit {
  questions: string[] = [];
  answers: string[] = [];
  smileEmojis = ['😄', '😊', '😐', '😔', '😩'];
  questionNum = signal(0);

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.questions = this.quizService.getQuestions();
    this.answers = this.quizService.getAnswers();
  }

  increment() {
    this.questionNum.update((question) => question + 1);
  }

  decrement() {
    this.questionNum.update((question) => question - 1);
  }
}
