import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, CoursesService } from '../../services/courses.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  editable = false; 
  selectedId: string | null = null;

  authorMap: Record<string, string> = {};

  constructor(
    @Optional() private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private authService: AuthService
  ) {
    this.authService.isAdmin$.subscribe(isAdmin => this.editable = isAdmin);
  }

  ngOnInit(): void {
   
    if (this.route) {
      this.route.paramMap.subscribe(p => this.selectedId = p.get('id'));
    }
    this.loadCourses();

    this.coursesService.getAllAuthors().subscribe(authors => {
      this.authorMap = Object.fromEntries(authors.map(a => [a.id, a.name]));
    });
  }

  private loadCourses(searchText?: string) {
    const obs = searchText
      ? this.coursesService.filterCourses(searchText)
      : this.coursesService.getAll();

    obs.subscribe(courses => {
      this.courses = courses;
      this.filteredCourses = courses;
    });
  }

  onSearch(query: string) {
    this.loadCourses(query);
  }

  onShowCourse(id: string) { this.router.navigate(['/courses', id]); }
  onEditCourse(id: string) { this.router.navigate(['/courses', 'edit', id]); }
  onDeleteCourse(id: string) {
    this.coursesService.deleteCourse(id).subscribe(() => {
      this.loadCourses();
      if (this.selectedId === id) this.router.navigate(['/courses']);
    });
  }

  onAddCourse() {
    this.router.navigate(['/courses/add']);
  }

  onCancel(): void {
    this.router.navigate(['/courses']);
  }
}
