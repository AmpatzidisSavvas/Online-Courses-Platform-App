import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLectureFormComponent } from './edit-lecture-form.component';

describe('EditLectureFormComponent', () => {
  let component: EditLectureFormComponent;
  let fixture: ComponentFixture<EditLectureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLectureFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditLectureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
