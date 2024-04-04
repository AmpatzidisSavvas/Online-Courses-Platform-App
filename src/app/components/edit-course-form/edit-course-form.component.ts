import { Component,  EventEmitter,  Input,  OnInit, Output, inject } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course } from '../../types';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-course-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-course-form.component.html',
  styleUrl: './edit-course-form.component.scss'
})
export class EditCourseFormComponent implements OnInit {

  @Input() course: Course | null = null;
  isEditCourseModalOpen = false
  courseFormEdit!: FormGroup;
  courseId: string = '';

  constructor(private fb: FormBuilder,private route: ActivatedRoute, private router: Router, private firestore: Firestore) {}


  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.loadCourse();
  }

  initializeForm(): void {
    this.courseFormEdit = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: ['', Validators.required]
    });
  }

  async loadCourse(): Promise<void> {

    const courseDocRef = doc(this.firestore, `courses/${this.courseId}`);
    const courseSnapshot = await getDoc(courseDocRef);

    if (courseSnapshot.exists()) {
      this.course = courseSnapshot.data() as Course;
      this.courseFormEdit.patchValue({
        title: this.course.title,
        description: this.course.description,
        category: this.course.category
      });
    } else {
      console.error('Course not found');
    }
  }


  async onSubmit(): Promise<void> {

    if (this.courseFormEdit.valid) {

      const updatedCourse: Course = {
        ...this.course,
        ...this.courseFormEdit.value
      }

      const docRef = doc(this.firestore, `courses/${this.courseId}`);
      await updateDoc(docRef, updatedCourse);
      console.log('Course updated successfully');
      this.router.navigate(['/courses']);
      
    }
    
  }

}
