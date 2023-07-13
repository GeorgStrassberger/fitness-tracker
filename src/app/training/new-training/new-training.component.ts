import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  private exerciseSubs$!: Subscription;
  exercises: Exercise[] = [];
  private loadingSubs$!: Subscription;
  isLoading: boolean = true;

  constructor(
    private trainingService: TrainingService,
    private uiServcie: UIService
  ) {}

  ngOnInit(): void {
    this.loadingSubs$ = this.uiServcie.loadingStateChanged.subscribe(
      (isLoading: boolean): void => {
        this.isLoading = isLoading;
      }
    );
    this.exerciseSubs$ =
      this.trainingService.availableExercisesChanged$.subscribe(
        (exercises): void => {
          if (exercises) {
            this.exercises = exercises;
          }
        }
      );
    this.fetchExercises();
  }

  fetchExercises(): void {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm): void {
    this.trainingService.startExercise(form.value.exercise); // exercise is the key who stored the selected exersice.id in the form {object}
  }

  ngOnDestroy(): void {
    if (this.exerciseSubs$) {
      this.exerciseSubs$.unsubscribe();
    }
    if (this.loadingSubs$) {
      this.loadingSubs$.unsubscribe();
    }
  }
}
