import { Routes } from '@angular/router';

export const routes: Routes = [

  // Redirección inicial
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Landing
  {
    path: 'landing',
    loadComponent: () =>
      import('./pages/landing-page/landing-page')
        .then(m => m.LandingPage)
  },

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login')
        .then(m => m.LoginComponent)
  },

  // Register
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register')
        .then(m => m.RegisterComponent)
  }

];