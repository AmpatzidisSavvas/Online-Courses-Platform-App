import { Component, Input, inject } from '@angular/core';
import { Course, Lecture } from '../../types';
import { CommonModule } from '@angular/common';
import { PickerFileMetadata, PickerOptions } from 'filestack-js';
import { FilestackService } from '../../services/filestack.service';
import { Firestore, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { EditLectureFormComponent } from "../edit-lecture-form/edit-lecture-form.component";
import { ModalComponent } from "../modal/modal.component";

@Component({
    selector: 'app-lecture-list-item',
    standalone: true,
    templateUrl: './lecture-list-item.component.html',
    styleUrl: './lecture-list-item.component.scss',
    imports: [CommonModule, EditLectureFormComponent, ModalComponent]
})
export class LectureListItemComponent {

  isOpen = false;
  @Input() lecture!: Lecture;
  @Input() course!: Course;
  isEditLectureModalOpen = false;
  filestack = inject(FilestackService);
  firestore = inject(Firestore);


  toggle() {
    if (!this.lecture.description && !this.lecture.videoUrl) {
      return;
    }
    this.isOpen = !this.isOpen;
  }

  uploadLectureVideo(event: Event) {

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

        this.setLectureVideo(res.filesUploaded[0]);
      }
    }
    this.filestack.openPicker(options);
  }

  async setLectureVideo(file: PickerFileMetadata) {
    
    const docRef = doc(this.firestore, `courses/${this.course.id}/lectures/${this.lecture.id}`);
    await updateDoc(docRef, {
      ...this.lecture,
      videoUrl: file.url
    })
  
    this.lecture.videoUrl = file.url;
  } 

  async deletePreviousVideo() {

    if(!this.lecture.videoUrl) {
      return;
    }

    const handle = this.lecture.videoUrl?.split('/').at(-1) as string

    if(!handle) {
      return;
    }

    const response = await this.filestack.deleteFile(handle);
    console.log(response);
  }


  async deleteLecture(lectureId: string) {

    try {
      const docRef = doc(this.firestore, `courses/${this.course.id}/lectures/${lectureId}`);
      await deleteDoc(docRef);
      console.log("Lecture deleted successfully");
    } catch (error) {
      console.error("Error deleting lecture:", error);
    }
  }
}
