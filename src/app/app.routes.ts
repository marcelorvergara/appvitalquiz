import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './components/auth/auth.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'patient-area',
    loadComponent: () =>
      import('./pages/patient/patient.component').then(
        (mod) => mod.PatientComponent
      ),
  },
  {
    path: 'doctor-area',
    loadComponent: () =>
      import('./pages/doctor/doctor.component').then(
        (mod) => mod.DoctorComponent
      ),
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
];
