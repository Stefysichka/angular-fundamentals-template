import { Component } from '@angular/core';
import { mockedCoursesList } from '../../shared/mocks/mocks';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  courses = mockedCoursesList;
  filteredCourses = mockedCoursesList;
  editable = true;

  showCourse(id: string) {
    console.log('Show course', id);
  }

  editCourse(id: string) {
    console.log('Edit course', id);
  }

  deleteCourse(id: string) {
    console.log('Delete course', id);
    this.courses = this.courses.filter(c => c.id !== id);
    this.filteredCourses = this.filteredCourses.filter(c => c.id !== id);
  }

  onSearch(query: string) {
    if (!query) {
      this.filteredCourses = this.courses;
      return;
    }
    this.filteredCourses = this.courses.filter(c =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}
