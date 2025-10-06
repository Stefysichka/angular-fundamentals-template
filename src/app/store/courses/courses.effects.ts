import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CoursesActions from '@app/store/courses/courses.actions';
import { CoursesService } from '@app/services/courses.service';
import { CoursesStateFacade } from '@app/store/courses/courses.facade';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom, tap } from 'rxjs';

@Injectable()
export class CoursesEffects {
    constructor(
        private actions$: Actions,
        private coursesService: CoursesService,
        private coursesStateFacade: CoursesStateFacade,
        private router: Router
    ) { }

    getAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestAllCourses),
      mergeMap(() =>
        this.coursesService.getAll().pipe(
          map((courses) => CoursesActions.requestAllCoursesSuccess({ courses })),
          catchError((error) => of(CoursesActions.requestAllCoursesFail({ error })))
        )
      )
    )
  );

  filteredCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestFilteredCourses),
      withLatestFrom(this.coursesStateFacade.allCourses$),
      map(([action, allCourses]) => {
        const filtered = allCourses.filter((course) =>
          course.title.toLowerCase().includes(action.title.toLowerCase())
        );
        return CoursesActions.requestFilteredCoursesSuccess({ courses: filtered });
      }),
      catchError((error) => of(CoursesActions.requestFilteredCoursesFail({ error })))
    )
  );

  getSpecificCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestSingleCourse),
      switchMap(({ id }) =>
        this.coursesService.getCourse(id).pipe(
          map((course) => CoursesActions.requestSingleCourseSuccess({ course })),
          catchError((error) => of(CoursesActions.requestSingleCourseFail({ error })))
        )
      )
    )
  );

  deleteCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestDeleteCourse),
      mergeMap(({ id }) =>
        this.coursesService.deleteCourse(id).pipe(
          map(() => CoursesActions.requestAllCourses()),
          catchError((error) => of(CoursesActions.requestDeleteCourseFail({ error })))
        )
      )
    )
  );

  editCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestEditCourse),
      mergeMap(({ id, course }) =>
        this.coursesService.editCourse(id, course).pipe(
          map((updated) => CoursesActions.requestEditCourseSuccess({ course: updated })),
          catchError((error) => of(CoursesActions.requestEditCourseFail({ error })))
        )
      )
    )
  );

  createCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.requestCreateCourse),
      mergeMap(({ course }) =>
        this.coursesService.createCourse(course).pipe(
          map((created) => CoursesActions.requestCreateCourseSuccess({ course: created })),
          catchError((error) => of(CoursesActions.requestCreateCourseFail({ error })))
        )
      )
    )
  );

  redirectToTheCoursesPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CoursesActions.requestCreateCourseSuccess,
          CoursesActions.requestEditCourseSuccess,
          CoursesActions.requestSingleCourseFail
        ),
        tap(() => this.router.navigate(['/courses']))
      ),
    { dispatch: false }
  );
}
