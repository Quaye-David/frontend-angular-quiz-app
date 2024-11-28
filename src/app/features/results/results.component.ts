// results.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizStateService } from '../../core/services/quiz-state.service';
import { QuizCategory } from '../../core/models/quiz.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-container">
      <div class="score-card">
        <h1 class="quiz-complete">Quiz completed!</h1>
        @if (currentQuiz) {
          <div class="quiz-info">
            <span class="quiz-icon"
                  [style.background-color]="getIconBackground(currentQuiz.title)">
              <!-- Quiz icon here -->
            </span>
            <span class="quiz-title">{{ currentQuiz.title }}</span>
          </div>
        }
        <div class="score-section">
          <p class="score-text">Your score</p>
          <h2 class="score">{{ score }} out of {{ totalQuestions }}</h2>
        </div>
        <button class="retry-button" (click)="retryQuiz()">
          Try Again
        </button>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      max-width: 80%;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .score-card {
      background: var(--color-white);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-container);
      box-shadow: var(--shadow-default);
      text-align: center;
      width: 100%;
      max-width: 600px;
    }

    .quiz-complete {
      color: var(--color-dark-navy);
      margin-bottom: var(--spacing-xl);
    }

    .quiz-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-m);
      margin-bottom: var(--spacing-xl);
    }

    .score-section {
      margin-bottom: var(--spacing-xl);
    }

    .score-text {
      color: var(--color-grey-navy);
      margin-bottom: var(--spacing-s);
    }

    .score {
      font-size: var(--fs-heading-l);
      color: var(--color-dark-navy);
    }

    .retry-button {
      background: var(--color-purple);
      color: var(--color-white);
      border: none;
      padding: var(--spacing-m) var(--spacing-xl);
      border-radius: 24px;
      font-size: var(--fs-body-m);
      font-weight: var(--fw-medium);
      cursor: pointer;
      transition: transform var(--transition-timing);
    }

    .retry-button:hover {
      transform: scale(1.05);
    }
  `]
})
export class ResultsComponent implements OnInit {
  currentQuiz?: QuizCategory;
  score = 0;
  totalQuestions = 0;

  constructor(private readonly quizStateService: QuizStateService) {}

  ngOnInit() {
    const state = this.quizStateService.quizState;
    this.currentQuiz = state.currentCategory as QuizCategory;
    this.score = state.score;
    this.totalQuestions = state.totalQuestions;
  }

  getIconBackground(quizTitle: string): string {
    const backgroundMap: { [key: string]: string } = {
      'HTML': 'var(--icon-html)',
      'CSS': 'var(--icon-css)',
      'JavaScript': 'var(--icon-js)',
      'Accessibility': 'var(--icon-accessibility)'
    };
    return backgroundMap[quizTitle] || 'transparent';
  }

  retryQuiz() {
    if (this.currentQuiz) {
      this.quizStateService.selectCategory(this.currentQuiz);
    }
  }
}