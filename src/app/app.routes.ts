import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { canActivateRoute } from './components/auth/auth.guard';
import { PatientsListComponent } from './components/patients/patients-list/patients-list.component';
import { PatientRegisterComponent } from './components/patients/patient-register/patient-register.component';
import { SigninComponent } from './components/auth/login/signin.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { PatientComponent } from './pages/patient/patient.component';
import { QuizComponent } from './components/quiz-patient/quiz.component';
import { PatientResultsComponent } from './components/patients/patient-results/patient-results.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'patient-area',
    component: PatientComponent,
    children: [
      {
        path: ':requester/:patient/:testId',
        component: QuizComponent,
      },
    ],
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
        children: [
          {
            path: ':name/edit',
            component: PatientRegisterComponent,
          },
        ],
      },
      {
        path: 'patient-results',
        component: PatientResultsComponent,
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
