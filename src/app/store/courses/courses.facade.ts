import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as CoursesActions from '@app/store/courses/courses.actions';
import * as CoursesSelectors from '@app/store/courses/courses.selectors';
import { CoursesState } from '@app/store/courses/courses.reducer';
import { Course } from '@app/services/courses.service';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CoursesStateFacade {
    isAllCoursesLoading$: Observable<boolean> = this.store.pipe(
    select(CoursesSelectors.isAllCoursesLoadingSelector)
  );

  isSingleCourseLoading$: Observable<boolean> = this.store.pipe(
    select(CoursesSelectors.isSingleCourseLoadingSelector)
  );

  isSearchingState$: Observable<boolean> = this.store.pipe(
    select(CoursesSelectors.isSearchingStateSelector)
  );

  courses$: Observable<Course[]> = this.store.pipe(
    select(CoursesSelectors.getCourses)
  );

  allCourses$: Observable<Course[]> = this.store.pipe(
    select(CoursesSelectors.getAllCourses)
  );

  course$: Observable<Course | null> = this.store.pipe(
    select(CoursesSelectors.getCourse)
  );

  errorMessage$: Observable<string | null> = this.store.pipe(
    select(CoursesSelectors.getErrorMessage)
  );

  constructor(private store: Store<CoursesState>) {}

  getAllCourses(): void {
    this.store.dispatch(CoursesActions.requestAllCourses());
  }

  getSingleCourse(id: string): void {
    this.store.dispatch(CoursesActions.requestSingleCourse({ id }));
  }

  getFilteredCourses(searchValue: string): void {
    this.store.dispatch(
      CoursesActions.requestFilteredCourses({ title: searchValue })
    );
  }

  editCourse(body: Course, id: string): void {
    this.store.dispatch(CoursesActions.requestEditCourse({ id, course: body }));
  }

  createCourse(body: Course): void {
    this.store.dispatch(CoursesActions.requestCreateCourse({ course: body }));
  }

  deleteCourse(id: string): void {
    this.store.dispatch(CoursesActions.requestDeleteCourse({ id }));
  }
}
