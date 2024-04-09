import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { Firestore, doc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Lecture } from '../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { getDoc, updateDoc } from '@firebase/firestore';

@Component({
  selector: 'app-edit-lecture-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-lecture-form.component.html',
  styleUrl: './edit-lecture-form.component.scss',
})
export class EditLectureFormComponent implements OnInit {

  @Input() lecture!: Lecture;
  isEditLectureModalOpen = false;
  lectureFormEdit!: FormGroup;
  courseId: string ='';
  lectureId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    this.lectureId = this.lecture.id;
    this.initializeForm();
    this.loadLecture();
  }
  

  initializeForm(): void {
    this.lectureFormEdit = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', Validators.required],
    });
  }

  async loadLecture(): Promise<void> {

    const lectureDocRef = doc( this.firestore, `courses/${this.courseId}/lectures/${this.lectureId}`);
    const lectureSnapshot = await getDoc(lectureDocRef);

    if (lectureSnapshot.exists() ) {
      this.lecture = lectureSnapshot.data() as Lecture;
      this.lectureFormEdit.patchValue({
        title: this.lecture.title,
        description: this.lecture.description,
        duration: this.lecture.duration
      });
    } else {
      console.error('Lecture not found');
    }
  }

  async onSubmit(): Promise<void> {

    if (this.lectureFormEdit.valid) {

      const updatedLecture: Lecture = {
        ...this.lecture,
        ...this.lectureFormEdit.value
      }
      
      const docRef = doc(this.firestore, `courses/${this.courseId}/lectures/${this.lectureId}`);
      await updateDoc(docRef, updatedLecture);
      console.log('Lecture updated successfully');
      this.router.navigate([`courses/${this.courseId}`])
    }
  }
}
