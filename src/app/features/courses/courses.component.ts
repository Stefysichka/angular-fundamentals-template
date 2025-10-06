import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, CoursesService } from '../../services/courses.service';
import { UserStoreService } from '../../user/services/user-store.service';
import { CoursesStateFacade } from '@app/store/courses/courses.facade';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses$ = this.coursesFacade.allCourses$;
  editable = false;
  selectedCourse?: Course;

  authorMap: Record<string, string> = {};

  constructor(
    @Optional() private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private coursesFacade: CoursesStateFacade,
    private userStore: UserStoreService,
  ) {
    this.userStore.isAdmin$.subscribe(isAdmin => this.editable = isAdmin);
  }

  ngOnInit(): void {
    this.coursesFacade.getAllCourses();
    this.coursesService.getAllAuthors().subscribe(authors => {
      this.authorMap = Object.fromEntries(authors.map(a => [a.id, a.name]));
    });
  }

  onSearch(query: string) {
    if (query.trim()) {
      this.coursesFacade.getFilteredCourses(query);
    } else {
      this.coursesFacade.getAllCourses();
    }
  }

  onShowCourse(id: string) {
    this.coursesFacade.getSingleCourse(id);
    this.coursesFacade.course$.subscribe(course => {
      this.selectedCourse = course || undefined;
    });
  }

  onEditCourse(id: string) {
    this.router.navigate(['/courses', 'edit', id]);
  }

  onDeleteCourse(id: string) {
    this.coursesFacade.deleteCourse(id);
  }

  onAddCourse() {
    this.router.navigate(['/courses/add']);
  }

  onCancel(): void {
    this.router.navigate(['/courses']);
  }

  onBack() {
    this.selectedCourse = undefined;
  }
}
