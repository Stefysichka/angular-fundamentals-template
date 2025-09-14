import { Component } from '@angular/core';
import { mockedCoursesList } from '../../shared/mocks/mocks';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {
  courses = mockedCoursesList;
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
  }
}
