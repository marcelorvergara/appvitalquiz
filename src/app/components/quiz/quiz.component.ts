import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from './quiz.service';
import { QuizQuestionsComponent } from './quiz-questions/quiz-questions.component';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, QuizQuestionsComponent, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent implements OnInit {
  questions: string[] = [];
  answers: string[] = [];
  smileEmojis = ['😄', '😊', '😐', '😔', '😩'];
  questionNum = signal(0);
  answer: string = '';

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.questions = this.quizService.getQuestions();
    this.answers = this.quizService.getAnswers();
  }

  increment(quizForm: NgForm) {
    console.log(this.questionNum(), quizForm.value.answer);
    this.questionNum.update((question) => question + 1);
  }

  decrement(quizForm: NgForm) {
    this.questionNum.update((question) => question - 1);
    console.log(this.questionNum());
  }

  onSubmit() {}
}
