import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from './quiz.service';
import { QuizQuestionsComponent } from './quiz-questions/quiz-questions.component';
import { FormsModule, NgForm } from '@angular/forms';
import {
  animate,
  style,
  transition,
  trigger,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, QuizQuestionsComponent, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
  animations: [
    trigger('fadeInOut', [
      state('open', style({ backgroundColor: 'transparent' })),
      state('closed', style({ backgroundColor: 'transparent' })),
      transition('open => closed', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 })),
      ]),
      transition('closed => open', [
        animate('0.2s ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class QuizComponent implements OnInit {
  questions: string[] = [];
  answers: string[] = [];
  smileEmojis = ['😄', '😊', '😐', '😔', '😩'];
  questionNum = signal(0);
  answer: string = '';
  isOpen = true;

  constructor(private quizService: QuizService) {
    effect(() => {
      this.isOpen = !this.isOpen;
    });
  }

  ngOnInit(): void {
    this.questions = this.quizService.getQuestions();
    this.answers = this.quizService.getAnswers();
  }

  increment(quizForm: NgForm) {
    console.log(this.questionNum(), quizForm.value.answer);
    this.questionNum.update((question) => question + 1);
    this.isOpen = !this.isOpen;
  }

  decrement(quizForm: NgForm) {
    this.questionNum.update((question) => question - 1);
    console.log(this.questionNum());
    this.isOpen = !this.isOpen;
  }

  onSubmit() {}
}
