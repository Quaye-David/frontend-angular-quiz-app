import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

//Components
import { StartMenuComponent } from './features/start-menu/start-menu.component';
import { QuizHeaderComponent } from './shared/components/quiz-header.component';
import { QuizComponent } from './features/quiz/quiz.component';

//Services
import { QuizDataService } from './core/services/quiz-data.service';
import { QuizStateService, ViewState } from './core/services/quiz-state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StartMenuComponent, QuizHeaderComponent, QuizComponent],
  providers: [QuizDataService, QuizStateService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  viewState$: Observable<ViewState>;

  constructor(private readonly quizStateService: QuizStateService) {
    this.viewState$ = this.quizStateService.viewState$;
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}