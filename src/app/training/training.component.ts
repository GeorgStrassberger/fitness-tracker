import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';
import { Exercise } from './exercise.model';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  onGoingTraining: boolean = false;
  private exerciseSubs$!: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.exerciseSubs$ = this.trainingService.exerciseChanged$.subscribe(
      (exercise) => {
        if (exercise) {
          this.onGoingTraining = true;
        } else {
          this.onGoingTraining = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.exerciseSubs$) {
      this.exerciseSubs$.unsubscribe();
    }
  }
}
