import { Routes } from '@angular/router';

export const routes: Routes = [

  // Redirección inicial
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
 
{
    path: 'home',
    loadComponent: () =>
      import('../app/pages/home/home')
        .then(m => m.Home)
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
  },

  //User
  {
    path: 'user',
    loadComponent: () =>
      import('./pages/user/user')
        .then(m => m.User)
  },

  //Group
  {
    path: 'groups',
    loadComponent: () =>
      import('./pages/groups/groups')
        .then(m => m.Groups)
  }
];