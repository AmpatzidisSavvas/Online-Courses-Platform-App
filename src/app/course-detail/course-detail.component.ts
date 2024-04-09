import { Component, Input, OnInit, inject } from '@angular/core';
import { Course, Lecture } from '../types';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from '../components/modal/modal.component';
import { CreateLectureFormComponent } from '../components/create-lecture-form/create-lecture-form.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LectureListItemComponent } from '../components/lecture-list-item/lecture-list-item.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { Firestore, collection, collectionData, deleteDoc, doc, getDoc, orderBy, query } from '@angular/fire/firestore';
import { EditCourseFormComponent } from "../components/edit-course-form/edit-course-form.component";
import { EditLectureFormComponent } from "../components/edit-lecture-form/edit-lecture-form.component";

@Component({
    selector: 'app-course-detail',
    standalone: true,
    templateUrl: './course-detail.component.html',
    styleUrl: './course-detail.component.scss',
    imports: [
        ModalComponent,
        CreateLectureFormComponent,
        AsyncPipe,
        LectureListItemComponent,
        LoaderComponent,
        EditCourseFormComponent,
    ]
})
export class CourseDetailComponent implements OnInit {
  
  @Input() course!: Course;
  @Input() lecture!: Lecture;
  isLoadingCourse = false;
  lectures$!: Observable<Lecture[]>;
  isCreateLectureModalOpen = false;
  isEditCourseModalOpen = false;
  isEditLectureModalOpen = false;
  activateRoute = inject(ActivatedRoute);
  firestore = inject(Firestore);
  router = inject(Router);

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

    try {
      this.isLoadingCourse = true;
      const courseDocRef = doc(this.firestore, `courses/${id}`);
      const courseDoSnapshot = await getDoc(courseDocRef);
      const course = courseDoSnapshot.data() as Course;
      this.course = course;
      this.isLoadingCourse = false

    }catch(error) {
      console.error("Error getting course:", error);
    }
  }

  async confirmDelete(id: string) {

    if(confirm(`Are you sure you want to delete ${this.course.title} course`)) {
      await this.deleteCourse(id);
      this.router.navigate(['/courses']);
    }
  }

  async deleteCourse(id: string) {
    
    try {

      const courseDocRef = doc(this.firestore, `courses/${id}`)
      await deleteDoc(courseDocRef);
      console.log("Course deleted successfully");


    } catch(error) {
      console.error("Error deleting course:", error);
    }
  }
}
