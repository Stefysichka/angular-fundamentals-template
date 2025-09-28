import { Component, OnInit } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private authService: AuthService
  ) {
    this.authService.isAdmin$.subscribe(isAdmin => this.editable = isAdmin);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => this.selectedId = p.get('id'));
    this.loadCourses();
  }

  private loadCourses(searchText?: string) {
    this.coursesService.getAll().subscribe(courses => {
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
    this.router.navigate(['/courses/new']);
  }
}