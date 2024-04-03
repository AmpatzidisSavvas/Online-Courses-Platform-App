import { Component, OnInit, inject } from '@angular/core';
import { Course, Lecture } from '../types';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from '../components/modal/modal.component';
import { CreateLectureFormComponent } from '../components/create-lecture-form/create-lecture-form.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LectureListItemComponent } from '../components/lecture-list-item/lecture-list-item.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { LECTURES } from '../dummy-data';
import { Firestore, collection, collectionData, doc, getDoc, orderBy, query } from '@angular/fire/firestore';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    ModalComponent,
    CreateLectureFormComponent,
    AsyncPipe,
    LectureListItemComponent,
    LoaderComponent,
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent implements OnInit {
  
  course!: Course | null;
  isLoadingCourse = false;
  lectures$!: Observable<Lecture[]>;
  isCreateLectureModalOpen = false;
  activateRoute = inject(ActivatedRoute);
  firestore = inject(Firestore);

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.paramMap.get('id') as string
    this.getCourse(id);
    const lecturesRef = query(
      collection(this.firestore, `courses/${id}/lectures`), 
      orderBy('cts', 'asc')
    );
    this.lectures$ = collectionData(lecturesRef) as Observable<Lecture[]>;
  }

  async getCourse(id: string) {
    this.isLoadingCourse = true;
    const courseDocRef = doc(this.firestore, `courses/${id}`);
    const courseDoSnapshot = await getDoc(courseDocRef);
    const course = courseDoSnapshot.data() as Course;
    this.course = course;
    this.isLoadingCourse = false
  }
}
