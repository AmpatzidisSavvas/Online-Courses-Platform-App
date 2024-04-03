import { Injectable } from '@angular/core';
import { Client, PickerOptions, init } from 'filestack-js';

@Injectable({
  providedIn: 'root'
})
export class FilestackService {

  client: Client;

  constructor() {
    this.client = init('Api key of Filestack');

  }

  openPicker(config: PickerOptions) {
   return this.client.picker(config).open();
  }

  deleteFile(handle: string) {
    return this.client.remove(handle, {
      policy: 'Put the -URL Safe Base64 encoded Policy- from your Security (Filestack) ',
      signature: 'Put the -HMAC-SHA256 Signature in hex- from your Security (Filestack) '
    });
  }
   
}
