import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuizCategory } from '../models/quiz.model';
import { QuizState } from '../models/quiz-state.model';
import { QuizError, QuizErrorHandler } from '../../utils/error-handler';

export enum ViewState {
  START_MENU = 'START_MENU',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT',
}
@Injectable({
  providedIn: 'root'
})
export class QuizStateService {
  private readonly STORAGE_KEY = 'quiz-state';
  private readonly _quizState: QuizState;

  private readonly selectedCategorySubject = new BehaviorSubject<QuizCategory | undefined>(undefined);
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  constructor() {
    this._quizState = this.loadState() || {
      currentCategory: null,
      currentQuestionIndex: 0,
      selectedAnswers: [],
      score: 0,
      totalQuestions: 0,
      isQuizCompleted: false
    };

     // Restore selected category if exists
     if (this._quizState.currentCategory) {
      this.selectedCategorySubject.next(this._quizState.currentCategory);
    }


     // Initialize view state
     const savedView = localStorage.getItem('view_state');
     this.viewStateSubject.next(savedView as ViewState || ViewState.START_MENU);
   }

  private saveState(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._quizState));
    localStorage.setItem('view_state', this.viewStateSubject.getValue());
  }

  private loadState(): QuizState | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return null;

      const state = JSON.parse(saved);
      return state;
    } catch (error) {
      QuizErrorHandler.handleError(error);
      return null;
    }
  }

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
      this.saveState();
    } catch (error) {
      QuizErrorHandler.handleError(error);
    }
  }

  private calculateTotalQuestions(category: QuizCategory): number {
    return category.questions.length;
  }

  submitAnswer(answer: string): boolean {
    const currentQuestion = this._quizState.currentCategory?.questions[this._quizState.currentQuestionIndex];
    const isCorrect = currentQuestion?.answer === answer;

    if (isCorrect) {
      this._quizState.score++;
    }
    this.saveState();
    this._quizState.selectedAnswers[this._quizState.currentQuestionIndex] = answer;
    return isCorrect;
  }

  nextQuestion(): void {
    if (this._quizState.currentQuestionIndex < this._quizState.totalQuestions - 1) {
      this._quizState.currentQuestionIndex++;
    } else {
      this._quizState.isQuizCompleted = true;
      this.viewStateSubject.next(ViewState.RESULT);
    }
    this.saveState();
  }

  resetQuiz(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.setItem('view_state', ViewState.START_MENU);
    this.viewStateSubject.next(ViewState.START_MENU);
    this._quizState.currentCategory = null;
    this._quizState.currentQuestionIndex = 0;
    this._quizState.selectedAnswers = [];
    this._quizState.score = 0;
    this._quizState.totalQuestions = 0;
    this._quizState.isQuizCompleted = false;
  }
}