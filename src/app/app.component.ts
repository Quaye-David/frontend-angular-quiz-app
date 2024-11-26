// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { QuizDataService } from './core/services/quiz-data.service';
import { QuizStateService } from './core/services/quiz-state.service';
import { QuizCategory } from './core/models/quiz.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quiz-container">
      @if (!isDataLoaded) {
        <p>Loading quiz data...</p>
      } @else {
        <div class="quiz-list">
          <h1>Available Quizzes</h1>

          @if (quizCategories.length === 0) {
            <p>No quizzes found.</p>
          } @else {
            <div class="quiz-grid">
              @for (quiz of quizCategories; track quiz.title) {
                <div class="quiz-card">
                  <h2>{{ quiz.title }}</h2>
                  <p>Icon: {{ quiz.icon }}</p>
                  <p>Total Questions: {{ quiz.questions.length }}</p>
                  <button (click)="selectQuiz(quiz)">Start Quiz</button>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .quiz-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .quiz-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
    .quiz-card {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }
  `]
})
export class AppComponent implements OnInit {
  isDataLoaded = false;
  quizCategories: QuizCategory[] = [];

  constructor(
    private readonly quizDataService: QuizDataService,
    private readonly quizStateService: QuizStateService
  ) {}

  async ngOnInit() {
    try {
      // Load quiz data
      this.quizCategories = await this.quizDataService.loadQuizData();

      // Log the loaded data for debugging
      console.log('Loaded Quizzes:', this.quizCategories);

      // Mark data as loaded
      this.isDataLoaded = true;
    } catch (error) {
      console.error('Failed to load quiz data', error);
      // Optionally set an error state
      this.isDataLoaded = false;
    }
  }

  selectQuiz(quiz: QuizCategory) {
    // Set the selected quiz in the state service
    this.quizStateService.selectCategory(quiz);

    // Here you would typically navigate to the quiz or show the first question
    console.log('Selected Quiz:', quiz.title);
  }
}