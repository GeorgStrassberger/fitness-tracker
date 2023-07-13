import { Injectable, inject } from '@angular/core';
import { Exercise } from './exercise.model';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { UIService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  exerciseChanged$ = new Subject<Exercise | null>();
  availableExercisesChanged$ = new Subject<Exercise[] | null>();
  finishedExercisesChanged$ = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise!: Exercise | null;
  private fbSubs: Subscription[] = [];

  availableE$: Observable<Exercise[]>;
  finishedE$: Observable<Exercise[]>;

  firestore: Firestore = inject(Firestore);

  constructor(private uiService: UIService) {
    const dbCollAvailable = collection(this.firestore, 'availableExercises');
    this.availableE$ = collectionData(dbCollAvailable, {
      idField: 'id',
    }) as Observable<Exercise[]>;
    const dbCollFinished = collection(this.firestore, 'finishedExercises');
    this.finishedE$ = collectionData(dbCollFinished) as Observable<Exercise[]>;
  }

  /**
   * Push all Availabe exerises from Firebase in my Subscription array
   */
  fetchAvailableExercises(): void {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(
      this.availableE$.subscribe(
        (exercises: Exercise[]): void => {
          this.uiService.loadingStateChanged.next(false);
          this.availableExercises = exercises;
          this.availableExercisesChanged$.next([...this.availableExercises]); // copy of array
        },
        (error) => {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackbar(
            'Fetching Exercises faild, please try again later.',
            'OK',
            4000
          );
          this.availableExercisesChanged$.next(null);
        }
      )
    );
  }

  /**
   * Start the exercise with the selected ID
   * @param selectedId
   */
  startExercise(selectedId: string) {
    const foundExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    if (foundExercise) {
      this.runningExercise = foundExercise;
      this.exerciseChanged$.next({ ...this.runningExercise });
    }
  }
  /**
   * saves the values of the completed exercise and transfers them to Firebase
   */
  completeExercise(): void {
    if (this.runningExercise) {
      this.addDataToDatabase({
        id: this.runningExercise.id,
        name: this.runningExercise.name,
        duration: this.runningExercise.duration,
        calories: this.runningExercise.calories,
        date: this.getTimeStemp(),
        state: 'completed',
      });
    }

    this.runningExercise = null;
    this.exerciseChanged$.next(null);
  }

  /**
   * aborts the current exercise and saves the values and transfers them to Firebase
   * @param progress number
   */
  cancelExercise(progress: number): void {
    if (this.runningExercise) {
      this.addDataToDatabase({
        ...this.runningExercise,
        date: this.getTimeStemp(),
        state: 'cancelled',
      });
    }
    this.runningExercise = null;
    this.exerciseChanged$.next(null);
  }

  /**
   * returns the current exercise or null
   * @returns exercise | null
   */
  getRunningExercise() {
    if (this.runningExercise) {
      return { ...this.runningExercise };
    } else {
      return null;
    }
  }

  /**
   * Push all Completet or Canceld exercises in the subscription array
   * Retrieve completed or canceled exercises
   */
  fetchCompletedOrCanceledExercises() {
    this.fbSubs.push(
      this.finishedE$.subscribe((finished: Exercise[]) => {
        this.finishedExercisesChanged$.next(finished);
      })
    );
  }

  /**
   * Add a new document to finishedExercises CollectionReference with the given data.
   * @param exercise Exercise
   */
  private addDataToDatabase(exercise: Exercise): void {
    const dbCollFinished = collection(this.firestore, 'finishedExercises');
    addDoc(dbCollFinished, exercise);
  }

  /**
   * converts the current date into a pure number
   * @returns number
   */
  getTimeStemp(): number {
    const timestampe: number = new Date().getTime();
    console.log('timestampe:', timestampe);
    return timestampe;
  }

  /**
   * unsubsribe all subscriptions
   */
  cancelSubscription(): void {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }
}
