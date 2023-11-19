import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from './quiz.service';
import { FormsModule, NgForm } from '@angular/forms';
import {
  animate,
  style,
  transition,
  trigger,
  state,
} from '@angular/animations';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { QuizQuestionsComponent } from './quiz-questions/quiz-questions.component';
import { DataStorageService } from '../../shared/data-storage.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, QuizQuestionsComponent, FormsModule, RouterModule],
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
  // Animation
  isOpen = true;
  // Detached or doctor test (quiz)
  patientName = '';

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService
  ) {
    effect(() => {
      this.isOpen = !this.isOpen;
    });
  }

  ngOnInit(): void {
    this.questions = this.quizService.getQuestions();
    this.answers = this.quizService.getAnswers();

    // Check url for the test requester, doc id and uuid of the test
    if (this.route.firstChild) {
      this.route.firstChild.params.subscribe((params: Params) => {
        const requester = params['requester'];
        const patient = params['patient'];
        const testId = params['testId'];

        // Perform actions with the parameters here
        console.log(
          `Requester: ${requester}, Patient: ${patient}, Test ID: ${testId}`
        );

        // Chech in the repo if there is test
        this.dataStorageService
          .checkUUID(requester, patient, testId)
          .subscribe((respData) => {
            if (respData.fields.test_number?.stringValue !== testId) {
              this.patientName = '';
            } else {
              this.patientName = respData.fields.nome.stringValue.replaceAll(
                '_',
                ' '
              );
            }
          });
      });
    }
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
