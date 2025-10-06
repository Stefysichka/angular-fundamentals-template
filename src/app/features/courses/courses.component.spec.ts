import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoursesComponent } from './courses.component';
import { CoursesService } from '../../services/courses.service';

describe('CoursesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoursesComponent],
      imports: [HttpClientTestingModule], 
      providers: [CoursesService],      
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CoursesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
