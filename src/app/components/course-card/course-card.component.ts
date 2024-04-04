import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Course } from '../../types';
import { FilestackService } from '../../services/filestack.service';
import { PickerFileMetadata, PickerOptions } from 'filestack-js';

import { doc, updateDoc } from '@firebase/firestore';
import { Firestore, deleteDoc, getDoc } from '@angular/fire/firestore';
import { ModalComponent } from "../modal/modal.component";
import { EditCourseFormComponent } from "../edit-course-form/edit-course-form.component";

@Component({
    selector: 'app-course-card',
    standalone: true,
    templateUrl: './course-card.component.html',
    styleUrl: './course-card.component.scss',
    imports: [RouterLink, ModalComponent, EditCourseFormComponent]
})
export class CourseCardComponent {

  @Input() course!: Course;
  image: PickerFileMetadata | null = null;
  filestack = inject(FilestackService);
  firestore = inject(Firestore);

  constructor(private router: Router) {}

  editCourseImage(event: Event) {

    event.stopPropagation();
    const options: PickerOptions = {
      fromSources: [
        'local_file_system',
        'unsplash',
        'instagram'
      ],
      maxFiles: 1,
      uploadInBackground: false,
      onUploadDone: (res) => {

        if(this.course.imageUrl) {
          this.deletePreviousImage();
        }
        this.setCourseImage(res.filesUploaded[0]);
      }
    }
    this.filestack.openPicker(options);
  }

  async setCourseImage(file: PickerFileMetadata) {
    
    const docRef = doc(this.firestore, `courses/${this.course.id}`);
    await updateDoc(docRef, {
      ...this.course,
      imageUrl: file.url
    })
    this.image = file;
    this.course.imageUrl = file.url;
  } 

  async deletePreviousImage() {

    const handle = this.course.imageUrl?.split('/').at(-1) as string

    if(!handle) {
      return;
    }

    const response = await this.filestack.deleteFile(handle);
    console.log(response);
  }

  
}
