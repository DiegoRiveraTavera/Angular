import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

// 🔹 PrimeNG modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

// 🔹 Angular Forms (IMPORTANTE para ngModel)
import { FormsModule } from '@angular/forms';

// 🔹 Servicios
import { MessageService } from 'primeng/api';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),

    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),

    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),

    // 🔹 Aquí agregamos los módulos PrimeNG
    importProvidersFrom(
      ButtonModule,
      InputTextModule,
      PasswordModule,
      CardModule,
      ToastModule,
      FormsModule
    ),

    MessageService
  ]
};