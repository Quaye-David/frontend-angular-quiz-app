import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuizCategory } from '../models/quiz.model';
import { QuizState } from '../models/quiz-state.model';
import { QuizError, QuizErrorHandler } from '../../utils/error-handler';

export enum ViewState {
  START_MENU = 'START_MENU',
  QUIZ = 'QUIZ'
}
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

  private readonly selectedCategorySubject = new BehaviorSubject<QuizCategory | undefined>(undefined);
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  private readonly viewStateSubject = new BehaviorSubject<ViewState>(ViewState.START_MENU);
  viewState$ = this.viewStateSubject.asObservable();

  // Getter for the quiz state
  get quizState(): QuizState {
    return { ...this._quizState };
  }

  selectCategory(category: QuizCategory): void {
    try {
      if (!category) {
        throw new QuizError('Invalid category selected', 'STATE');
      }

      // Update the state
      this._quizState.currentCategory = category;
      this._quizState.totalQuestions = this.calculateTotalQuestions(category);
      this._quizState.currentQuestionIndex = 0;
      this._quizState.selectedAnswers = [];
      this._quizState.score = 0;
      this._quizState.isQuizCompleted = false;
      this.viewStateSubject.next(ViewState.QUIZ);
      
      // Emit the new category
      this.selectedCategorySubject.next(category);
    } catch (error) {
      QuizErrorHandler.handleError(error);
    }
  }

  private calculateTotalQuestions(category: QuizCategory): number {
    return category.questions.length;
  }
}