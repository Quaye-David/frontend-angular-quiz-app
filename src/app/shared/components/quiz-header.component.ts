// quiz-header.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizStateService } from '../../core/services/quiz-state.service';
import { QuizCategory } from '../../core/models/quiz.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="quiz-info">
        @if (selectedQuiz) {
        <span
          class="quiz-icon"
          [innerHTML]="getSafeIcon(selectedQuiz.icon)"
          [style.background-color]="getIconBackground(selectedQuiz.title)"
        >
        </span>
        <span class="quiz-name">{{ selectedQuiz.title }}</span>
        }
      </div>
      <div class="theme-toggle" [class.dark]="isDarkTheme">
        <span class="theme-icon">🌞</span>
        <button class="toggle-button" (click)="toggleTheme()">
          <span class="toggle-slider"></span>
        </button>
        <span class="theme-icon">🌙</span>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;
        padding-inline: var(--spacing-l);
        padding-block: var(--spacing-2xl);
        max-width: 80%;
      }
      .quiz-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-s);
      }
      .quiz-icon {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        padding: var(--spacing-xs);
      }
      .quiz-name {
        font-weight: 600;
        color: var(--color-gray-700);
      }
      .theme-toggle {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
      }
      .theme-toggle {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
      }

      .toggle-button {
        width: 48px;
        height: 28px;
        background: var(--color-purple);
        border-radius: 20px;
        position: relative;
        cursor: pointer;
        border: none;
        padding: 0;
      }

      .toggle-slider {
        position: absolute;
        width: 20px;
        height: 20px;
        background: var(--color-white);
        border-radius: 50%;
        left: 4px;
        top: 4px;
        transition: transform 0.3s ease;
      }

      .theme-toggle.dark .toggle-slider {
        transform: translateX(20px);
      }
    `,
  ],
})
export class QuizHeaderComponent implements OnInit, OnDestroy {
  @Input() isDarkTheme = false;
  @Output() themeToggled = new EventEmitter<boolean>();

  selectedQuiz?: QuizCategory;
  private subscription?: Subscription;

  constructor(
    private readonly quizStateService: QuizStateService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.subscription = this.quizStateService.selectedCategory$.subscribe(
      (quiz) => (this.selectedQuiz = quiz)
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getSafeIcon(iconContent: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(iconContent);
  }

  getIconBackground(quizTitle: string): string {
    const backgroundMap: { [key: string]: string } = {
      HTML: 'var(--icon-html)',
      CSS: 'var(--icon-css)',
      JavaScript: 'var(--icon-js)',
      Accessibility: 'var(--icon-accessibility)',
    };
    return backgroundMap[quizTitle] || 'transparent';
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeToggled.emit(this.isDarkTheme);
  }
}
