import { Component, OnInit, inject } from '@angular/core';
import { CourseCardComponent } from '../components/course-card/course-card.component';
import { ModalComponent } from '../components/modal/modal.component';
import { CreateCourseFormComponent } from '../components/create-course-form/create-course-form.component';
import { AsyncPipe } from '@angular/common';
import { LoaderComponent } from '../components/loader/loader.component';
import { Course } from '../types';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CourseCardComponent,
    ModalComponent,
    CreateCourseFormComponent,
    AsyncPipe,
    LoaderComponent,
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnInit {
  

  isCreateCourseModalOpen = false;
  courses$!: Observable <Course[]>;
  firestore = inject(Firestore);

  ngOnInit(): void {
    const courseRef = collection(this.firestore, 'courses');
    this.courses$ = collectionData(courseRef) as Observable<Course[]>;
  }

}
