import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css'],
})
export class PastTrainingsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  dataSource = new MatTableDataSource<Exercise>();
  displayedColumns: string[] = [
    'date',
    'name',
    'calories',
    'duration',
    'state',
  ];
  private exChangedSubs$!: Subscription;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.exChangedSubs$ =
      this.trainingService.finishedExercisesChanged$.subscribe((exercises) => {
        this.dataSource.data = exercises;
      });
    this.trainingService.fetchCompletedOrCanceledExercises();
  }

  doFilter(event: KeyboardEvent) {
    const filterValue: string = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    if (this.exChangedSubs$) {
      this.exChangedSubs$.unsubscribe();
    }
  }
}
