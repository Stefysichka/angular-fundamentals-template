import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CoursesComponent } from './courses.component';
import { CoursesStateFacade } from '@app/store/courses/courses.facade';
import { CoursesService } from '../../services/courses.service';
import { reducers, effects } from '@app/store';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoursesComponent],
      imports: [
        HttpClientTestingModule, 
        StoreModule.forRoot(reducers), 
        EffectsModule.forRoot(effects), 
      ],
      providers: [CoursesStateFacade, CoursesService],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
