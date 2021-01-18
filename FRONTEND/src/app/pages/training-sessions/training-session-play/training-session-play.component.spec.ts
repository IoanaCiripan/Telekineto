import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSessionPlayComponent } from './training-session-play.component';

describe('TrainingSessionPlayComponent', () => {
  let component: TrainingSessionPlayComponent;
  let fixture: ComponentFixture<TrainingSessionPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingSessionPlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingSessionPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
