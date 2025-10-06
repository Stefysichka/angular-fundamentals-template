import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, CoursesService } from '../../../services/courses.service';
import { CoursesStateFacade } from '@app/store/courses/courses.facade';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  submitted = false;
  formErrors: { [key: string]: string } = {};
  isEdit = false;
  editingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private library: FaIconLibrary,
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private coursesFacade: CoursesStateFacade
  ) {
    library.addIconPacks(fas);

    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      duration: ['', [Validators.required, Validators.min(0)]],
      author: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\s]+$/)]],
      authors: this.fb.array([]),
      courseAuthors: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;
    this.editingId = id;

    if (id) {
      this.coursesFacade.getSingleCourse(id);
      this.coursesFacade.course$.subscribe((course: Course | null) => {
        if (course) {
          this.courseForm.patchValue({
            title: course.title,
            description: course.description,
            duration: course.duration,
          });
          this.courseAuthors.clear();
          course.authors.forEach(authorId => {
            this.courseAuthors.push(this.fb.group({ id: [authorId], name: [''] }));
          });
        }
      });
    }

    this.coursesService.getAllAuthors().subscribe(authors => {
      authors.forEach(a => this.authors.push(this.fb.group(a)));
    });
  }

  get title() { return this.courseForm.get('title') as FormControl; }
  get description() { return this.courseForm.get('description') as FormControl; }
  get duration() { return this.courseForm.get('duration') as FormControl; }
  get author() { return this.courseForm.get('author') as FormControl; }
  get authors() { return this.courseForm.get('authors') as FormArray; }
  get courseAuthors() { return this.courseForm.get('courseAuthors') as FormArray; }

  addAuthor(index: number) {
    const authorGroup = this.authors.at(index);
    if (authorGroup) {
      const author = { ...authorGroup.value };
      this.courseAuthors.push(this.fb.group(author));
      this.authors.removeAt(index);
    }
  }

  removeAuthor(index: number) {
    const authorGroup = this.courseAuthors.at(index);
    if (authorGroup) {
      const author = { ...authorGroup.value };
      this.authors.push(this.fb.group(author));
      this.courseAuthors.removeAt(index);
    }
  }

  createAuthor() {
    const authorControl = this.author;
    if (!authorControl.value || authorControl.invalid) {
      authorControl.markAsTouched();
      this.formErrors['author'] = 'Author name is invalid';
      return;
    }
    this.coursesService.createAuthor(authorControl.value).subscribe(author => {
      this.authors.push(this.fb.group(author));
      authorControl.reset();
      this.formErrors['author'] = '';
    });
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

    const payload: Course = {
      id: this.editingId ?? '',
      title: this.title.value,
      description: this.description.value,
      duration: Number(this.duration.value) || 0,
      authors: this.courseAuthors.value.map((x: any) => x.id),
      creationDate: new Date(),
    };

    if (this.isEdit && this.editingId) {
      this.coursesFacade.editCourse(payload, this.editingId);
    } else {
      this.coursesFacade.createCourse(payload);
    }

    this.router.navigate(['/courses']);
  }

  onCancel() {
    this.router.navigate(['/courses']);
  }
}
