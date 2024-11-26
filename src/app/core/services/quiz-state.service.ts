import { Injectable } from '@angular/core';
import { QuizCategory } from '../models/quiz.model';
import { QuizState } from '../models/quiz-state.model';
import { QuizError, QuizErrorHandler } from '../../utils/error-handler';

@Injectable({
  providedIn: 'root'
})
export class QuizStateService {
  private readonly _quizState: QuizState = {
    currentCategory: null,
    currentQuestionIndex: 0,
    selectedAnswers: [],
    score: 0,
    totalQuestions: 0,
    isQuizCompleted: false
  };

  // Getter for the quiz state
  get quizState(): QuizState {
    return { ...this._quizState };
  }

  selectCategory(category: QuizCategory): void {
    try {
      if (!category) {
        throw new QuizError('Invalid category selected', 'STATE');
      }

      this._quizState.currentCategory = category;
      this._quizState.totalQuestions = this.calculateTotalQuestions(category);
      this._quizState.currentQuestionIndex = 0;
      this._quizState.selectedAnswers = [];
      this._quizState.score = 0;
      this._quizState.isQuizCompleted = false;
    } catch (error) {
      QuizErrorHandler.handleError(error);
    }
  }

  private calculateTotalQuestions(category: QuizCategory): number {
    return category.questions.length;
  }
}