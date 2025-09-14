import { Component, Input, Output, EventEmitter } from '@angular/core';
import { mockedAuthorsList } from '../../../shared/mocks/mocks';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent {
  @Input() courses: any[] = [];
  @Input() editable: boolean = false;

  @Output() showCourse = new EventEmitter<string>();
  @Output() editCourse = new EventEmitter<string>();
  @Output() deleteCourse = new EventEmitter<string>();

  getAuthorNames(ids: string[]): string[] {
    return mockedAuthorsList
      .filter(author => ids.includes(author.id))
      .map(author => author.name);
  }

  onShow(id: string) {
    this.showCourse.emit(id);
  }

  onEdit(id: string) {
    this.editCourse.emit(id);
  }

  onDelete(id: string) {
    this.deleteCourse.emit(id);
  }
}
