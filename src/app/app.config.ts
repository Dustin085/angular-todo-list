import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyCy3_cGe3oJtY6H-CqnhJAOlpBI1hrjEPA',
  authDomain: 'angular-todo-de18c.firebaseapp.com',
  projectId: 'angular-todo-de18c',
  storageBucket: 'angular-todo-de18c.firebasestorage.app',
  messagingSenderId: '577211004164',
  appId: '1:577211004164:web:d2ffedd4ff9632943ecc51',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
};
