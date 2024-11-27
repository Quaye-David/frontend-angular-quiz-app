import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizStateService } from '../../core/services/quiz-state.service';
import { QuizCategory } from '../../core/models/quiz.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  template: `
   <div class="quiz-container">
      @if (currentQuiz) {
        <div class="question-card">
          <p class="question-number">
            Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
          </p>
          <h2 class="question-text">
            {{ currentQuiz.questions[currentQuestionIndex].question }}
          </h2>
          <div class="options-list">
            @for (option of currentQuiz.questions[currentQuestionIndex].options; track $index) {
              <button
                class="option-button"
                [class.selected]="selectedAnswer === option"
                [class.correct]="isAnswerSubmitted && option === currentQuiz.questions[currentQuestionIndex].answer"
                [class.incorrect]="isAnswerSubmitted && selectedAnswer === option && option !== currentQuiz.questions[currentQuestionIndex].answer"
                [disabled]="isAnswerSubmitted"
                (click)="selectAnswer(option)">
                {{ option }}
              </button>
            }
          </div>
          <div class="action-button">
            @if (!isAnswerSubmitted) {
              <button
                class="submit-button"
                [disabled]="!selectedAnswer"
                (click)="submitAnswer()">
                Submit Answer
              </button>
            } @else {
              <button
                class="next-button"
                (click)="nextQuestion()">
                {{ currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question' }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .quiz-container {
      max-width: 80%;
      margin: 0 auto;
      padding: var(--spacing-l);
    }
    .question-card {
      background: var(--color-white);
      border-radius: var(--border-radius-container);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-default);
    }
    .question-number {
      color: var(--color-grey-navy);
      margin-bottom: var(--spacing-m);
    }
    .question-text {
      margin-bottom: var(--spacing-xl);
    }
    .options-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-m);
    }
    .option-button {
      text-align: left;
      padding: var(--spacing-m);
      background: var(--color-light-grey);
      border: 2px solid transparent;
      cursor: pointer;
    }
    .option-button:hover {
      background: var(--color-purple);
      color: var(--color-white);
    }
    .option-button.selected {
      border-color: var(--color-purple);
    }
    .option-button.correct {
      background-color: var(--color-green, #26d782);
      color: var(--color-white);
      border-color: var(--color-green, #26d782);
    }

    .option-button.incorrect {
      background-color: var(--color-warning);
      color: var(--color-white);
      border-color: var(--color-warning);
    }

    .action-button {
      margin-top: var(--spacing-xl);
      display: flex;
      justify-content: center;
    }

    .submit-button,
    .next-button {
      padding: var(--spacing-m) var(--spacing-xl);
      background: var(--color-purple);
      color: var(--color-white);
      border: none;
      font-weight: var(--fw-medium);
      cursor: pointer;
    }

    .submit-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class QuizComponent implements OnInit {
  currentQuiz?: QuizCategory;
  currentQuestionIndex = 0;
  totalQuestions = 0;
  selectedAnswer = '';
  isAnswerSubmitted = false;

  constructor(private readonly quizStateService: QuizStateService) {}

  ngOnInit() {
    const state = this.quizStateService.quizState;
    this.currentQuiz = state.currentCategory as QuizCategory;
    this.currentQuestionIndex = state.currentQuestionIndex;
    this.totalQuestions = state.totalQuestions;
  }

  selectAnswer(answer: string) {
    if (!this.isAnswerSubmitted) {
      this.selectedAnswer = answer;
    }
  }

  submitAnswer() {
    if (this.selectedAnswer) {
      this.isAnswerSubmitted = true;
      this.quizStateService.submitAnswer(this.selectedAnswer);
    }
  }

  nextQuestion() {
    this.quizStateService.nextQuestion();
    this.selectedAnswer = '';
    this.isAnswerSubmitted = false;
    this.currentQuestionIndex = this.quizStateService.quizState.currentQuestionIndex;
  }
}