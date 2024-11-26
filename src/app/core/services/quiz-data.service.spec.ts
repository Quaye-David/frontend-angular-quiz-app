/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuizDataService } from './quiz-data.service';

describe('Service: QuizData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizDataService]
    });
  });

  it('should ...', inject([QuizDataService], (service: QuizDataService) => {
    expect(service).toBeTruthy();
  }));
});
