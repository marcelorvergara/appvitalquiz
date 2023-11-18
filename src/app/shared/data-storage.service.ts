import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environmets';
import { Patient, Patients } from './models/patient.model';
import { AuthService } from '../components/auth/auth.service';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private databaseId = '(default)';
  private collectionPath = 'patients';
  private url = `https://firestore.googleapis.com/v1/projects/${environment.projectId}/databases/${this.databaseId}/documents/${this.collectionPath}`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  createPatient(data: Patient) {
    this.authService
      .getUserData()
      ?.subscribe((userData) => console.log(userData));
    return this.http
      .post(this.url + '?documentId=' + data.nome.replace(' ', '_'), {
        fields: this.convertToFirestoreFormat(data),
      })
      .pipe(catchError((errorResp) => this.handleError(errorResp)));
  }

  handleError(errorResp: HttpErrorResponse) {
    let errorMessage = 'Um erro desconhecido ocorreu...';
    if (!errorResp.error || !errorResp.error.error) {
      return throwError(() => errorMessage);
    }
    switch (errorResp.error.error.status) {
      case 'ABORTED':
        errorMessage =
          'A solicitação entrou em conflito com outra solicitação!';
        break;
      case 'ALREADY_EXISTS':
        errorMessage = 'Paciente já existente!';
        break;
      case 'DEADLINE_EXCEEDED':
        // Retry using exponential backoff.
        errorMessage = 'Erro na gravação do paciente!';
        break;
      default:
        errorMessage = 'Erro desconhecido...';
    }
    return throwError(() => errorMessage);
  }
  fetchPatients() {
    return this.http.get<Patients>(this.url);
  }

  private convertToFirestoreFormat(data: any) {
    const convertedData: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        convertedData[key] = this.convertValue(data[key]);
      }
    }
    return convertedData;
  }

  private convertValue(value: any) {
    if (typeof value === 'string') {
      return { stringValue: value };
    } else if (typeof value === 'number') {
      return { integerValue: value };
    } else if (typeof value === 'boolean') {
      return { booleanValue: value };
    }
    // Add more types as needed
    return null;
  }
}
