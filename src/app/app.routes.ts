import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { canActivateRoute } from './components/auth/auth.guard';

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
        path: 'patient-registry',
        loadComponent: () =>
          import(
            './components/cadastra-paciente/cadastra-paciente.component'
          ).then((mod) => mod.CadastraPacienteComponent),
      },
      {
        path: 'patients-list',
        loadComponent: () =>
          import('./components/patients-list/patients-list.component').then(
            (mod) => mod.PatientsListComponent
          ),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
];
