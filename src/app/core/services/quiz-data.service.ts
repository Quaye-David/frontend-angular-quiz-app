import { Injectable } from '@angular/core';
import { QuizCategory, QuizQuestion } from '../models/quiz.model';
import { QuizError, QuizErrorHandler } from '../../utils/error-handler';

@Injectable({
  providedIn: 'root'
})
export class QuizDataService {
  private quizData: QuizCategory[] = [];

  constructor() {}

  private async loadSvgIcon(path: string): Promise<string> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new QuizError(`Failed to load SVG icon: ${path}`, 'ICON_LOAD');
      }
      return await response.text();
    } catch (error) {
      console.error(`Error loading SVG: ${path}`, error);
      return ''; // Return empty string as fallback
    }
  }

  async loadQuizData(): Promise<QuizCategory[]> {
    try {
      const response = await fetch('data.json');
      if (!response.ok) {
        throw new QuizError(
          `Failed to fetch quiz data. Status: ${response.status}`,
          'DATA_LOAD'
        );
      }

      const data = await response.json();

      if (!this.validateQuizData(data)) {
        throw new QuizError('Invalid quiz data structure', 'VALIDATION');
      }

      // Load SVG content for each category
      this.quizData = await Promise.all(
        data.quizzes.map(async (category: QuizCategory) => ({
          ...category,
          icon: await this.loadSvgIcon(category.icon)
        }))
      );

      return this.quizData;
    } catch (error) {
      QuizErrorHandler.handleError(error);
      throw error;
    }
  }

  private validateQuizData(data: any): boolean {
    // Comprehensive data validation
    if (!data?.quizzes || !Array.isArray(data.quizzes)) {
      return false;
    }

    return data.quizzes.every((category: QuizCategory) => this.validateCategory(category));
  }

  private validateCategory(category: QuizCategory): boolean {
    // Check category structure
    if (!category.title || !category.icon || !category.questions) {
      return false;
    }

    return category.questions.every((question: QuizQuestion) => this.validateQuestion(question));
  }

  private validateQuestion(question: QuizQuestion): boolean {
    // Detailed question validation
    return (
      typeof question.question === 'string' && question.question.trim() !== '' &&
      question.options &&
      Array.isArray(question.options) &&
      question.options.length > 1 &&
      typeof question.answer === 'string' && question.answer.trim() !== '' &&
      question.options.includes(question.answer)
    );
  }

  // Getter methods
  getCategories(): QuizCategory[] {
    return this.quizData;
  }

  getCategoryByName(title: string): QuizCategory | undefined {
    return this.quizData.find(
      category => category.title === title
    );
  }

  getTotalQuestions(category: QuizCategory): number {
    return category.questions.length;
  }
}