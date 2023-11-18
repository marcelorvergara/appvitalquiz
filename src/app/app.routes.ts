import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { canActivateRoute } from './components/auth/auth.guard';
import { PatientsListComponent } from './components/patients-list/patients-list.component';
import { PatientRegisterComponent } from './components/patient-register/patient-register.component';
import { SigninComponent } from './components/auth/login/signin.component';
import { SignupComponent } from './components/auth/signup/signup.component';

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
    canActivate: [canActivateRoute],
    children: [
      {
        path: 'patients-list',
        component: PatientsListComponent,
      },
      {
        path: 'patient-registry',
        component: PatientRegisterComponent,
      },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'signin',
        component: SigninComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
    ],
  },
];
