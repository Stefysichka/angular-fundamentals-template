import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { mockedAuthorsList } from '../../mocks/mocks';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private library: FaIconLibrary) {
    library.addIconPacks(fas);
  }

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      duration: ['', [Validators.required, Validators.min(0)]],
      authors: this.fb.array([]),
      courseAuthors: this.fb.array([]),
      newAuthor: this.fb.group({
        author: ['', [Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\s]+$/)]],
      }),
    });

    mockedAuthorsList.forEach(a => {
      this.authors.push(this.fb.group({ id: [a.id], name: [a.name] }));
    });
  }

  get title() { return this.courseForm.get('title') as FormControl; }
  get description() { return this.courseForm.get('description') as FormControl; }
  get duration() { return this.courseForm.get('duration') as FormControl; }
  get authors() { return this.courseForm.get('authors') as FormArray; }
  get courseAuthors() { return this.courseForm.get('courseAuthors') as FormArray; }
  get newAuthor() { return this.courseForm.get('newAuthor') as FormGroup; }

  addAuthor(index: number) {
    const a = this.authors.at(index);
    this.courseAuthors.push(a);
    this.authors.removeAt(index);
  }

  removeAuthor(index: number) {
    const a = this.courseAuthors.at(index);
    this.authors.push(a);
    this.courseAuthors.removeAt(index);
  }

  createAuthor() {
    const ctrl = this.newAuthor.get('author') as FormControl;
    if (!ctrl.value || ctrl.invalid) return;
    const created = { id: Date.now().toString(), name: ctrl.value };
    this.authors.push(this.fb.group(created));
    ctrl.reset();
  }

  formatDuration(v: any): string {
    const n = Number(v) || 0;
    const h = Math.floor(n / 60);
    const m = n % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.courseForm.valid) {
      this.courseForm.markAllAsTouched();
      return;
    }
    const payload = {
      title: this.title.value,
      description: this.description.value,
      duration: Number(this.duration.value) || 0,
      authors: this.courseAuthors.value.map((x: any) => x.id),
    };
    console.log(payload);
  }
}
