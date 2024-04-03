import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'mini-udemy-4fbb5',
          appId: environment.id,
          storageBucket: 'mini-udemy-4fbb5.appspot.com',
          apiKey: environment.key,
          authDomain: 'mini-udemy-4fbb5.firebaseapp.com',
          messagingSenderId: environment.senderId,
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
