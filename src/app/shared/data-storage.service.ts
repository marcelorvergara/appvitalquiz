import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environmets';
import {
  Patient,
  Patients,
  PatientsDoc,
  MapValue,
} from './models/patient.model';
import { AuthService } from '../components/auth/auth.service';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private databaseId = '(default)';
  private collectionPath = 'patients';
  private url = `https://firestore.googleapis.com/v1/projects/${environment.projectId}/databases/${this.databaseId}/documents/`;
  private patientData: { name: string; data?: MapValue } = {
    name: '',
    data: undefined,
  };

  private patients: Patients = { documents: [] };
  private patientToEdit?: PatientsDoc;

  constructor(private http: HttpClient, private authService: AuthService) {}

  createPatient(data: Patient) {
    // TODO: Improve sec getUserData
    const drUserId = this.authService.getUserData();

    return this.http
      .post(
        this.url +
          this.collectionPath +
          '-' +
          drUserId +
          '?documentId=' +
          data.nome.trim().replaceAll(' ', '_'),
        {
          fields: this.convertToFirestoreFormat(data),
        }
      )
      .pipe(catchError((errorResp) => this.handleError(errorResp)));
  }

  editPatient(data: Patient) {
    // TODO: Improve sec getUserData
    const drUserId = this.authService.getUserData();

    return this.http
      .patch(
        this.url +
          this.collectionPath +
          '-' +
          drUserId +
          '/' +
          data.nome.trim().replaceAll(' ', '_') +
          '?currentDocument.exists=true&updateMask.fieldPaths=nome&updateMask.fieldPaths=email&updateMask.fieldPaths=phone&updateMask.fieldPaths=contact&alt=json',
        {
          fields: this.convertToFirestoreFormat(data),
        }
      )
      .pipe(catchError((errorResp) => this.handleError(errorResp)));
  }

  fetchPatients() {
    // TODO: improve sec getUserData
    const drUserId = this.authService.getUserData();

    return this.http
      .get<Patients>(this.url + this.collectionPath + '-' + drUserId)
      .pipe(
        tap((patients: Patients) => {
          if (patients) {
            this.patients = patients;
          }
        })
      );
  }

  getPatientToEdit(name: string) {
    const patient = this.patients.documents.find(
      (f) => f.fields.nome.stringValue === name
    );
    if (patient) {
      this.patientToEdit = patient;
      return 'ok';
    }
    return null;
  }

  checkPatientToEdit() {
    if (this.patientToEdit) {
      return this.patientToEdit;
    }
    return null;
  }

  deletePatientToEdit() {
    this.patientToEdit = undefined;
  }

  // Updatate paticent record with the test/quiz number
  patchPatient(collectionId: string, docId: string, testId: string) {
    const newTest = {
      test_number: {
        stringValue: testId,
      },
    };
    return this.http.patch<PatientsDoc>(
      this.url +
        this.collectionPath +
        '-' +
        collectionId +
        '/' +
        docId +
        '?currentDocument.exists=true&updateMask.fieldPaths=test_number&alt=json',
      { fields: newTest }
    );
  }

  getPatientTestResult(collectionId: string, docId: string): Observable<any> {
    const url = `${this.url}${this.collectionPath}-${collectionId}/${docId}?alt=json`;
    return this.http.get<PatientsDoc>(url).pipe(
      tap((patients) => {
        if (patients.fields.tests_results?.mapValue)
          this.patientData = {
            name: patients.fields.nome.stringValue,
            data: patients.fields.tests_results?.mapValue,
          };
      })
    );
  }

  getPatientResultData() {
    return {
      name: this.patientData?.name,
      data: this.patientData.data?.fields,
    };
  }

  mergeTestResults(
    existingData: any,
    newDate: string,
    newResultTestList: number[]
  ): any {
    const existingResults =
      existingData.fields.tests_results?.mapValue?.fields || {};
    const convertedArray = newResultTestList.map((value) => ({
      integerValue: value,
    }));

    // Merge new data with existing data
    existingResults[newDate] = { arrayValue: { values: convertedArray } };

    return existingResults;
  }

  updatePatientTestResult(
    collectionId: string,
    docId: string,
    mergedTestData: any
  ): Observable<any> {
    const url = `${this.url}${this.collectionPath}-${collectionId}/${docId}?currentDocument.exists=true&updateMask.fieldPaths=test_number&updateMask.fieldPaths=tests_results&alt=json`;
    const payload = {
      fields: {
        tests_results: {
          mapValue: {
            fields: mergedTestData,
          },
        },
        test_number: { stringValue: '' }, // Reset 'test_number' so the test can't be done again
      },
    };
    return this.http.patch(url, payload);
  }

  checkUUID(requester: string, patient: string, testId: string) {
    return this.http.get<PatientsDoc>(
      this.url + this.collectionPath + '-' + requester + '/' + patient
    );
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

  private convertToFirestoreFormat(data: any) {
    const convertedData: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        convertedData[key] = this.convertValue(data[key]);
      }
    }
    return convertedData;
  }

  private convertValue(value: any): any {
    switch (typeof value) {
      case 'string':
        return { stringValue: value.trim() };
      case 'number':
        // Firestore differentiates between integer and double values
        return Number.isInteger(value)
          ? { integerValue: value }
          : { doubleValue: value };
      case 'boolean':
        return { booleanValue: value };
      case 'object':
        if (value === null) {
          return { nullValue: null };
        } else if (Array.isArray(value)) {
          return { arrayValue: { values: value.map(this.convertValue) } };
        } else if (value instanceof Date) {
          return { timestampValue: value.toISOString() };
        } else {
          // Handling for maps (objects)
          let mapValue: any;
          for (const key in value) {
            if (value.hasOwnProperty(key)) {
              mapValue[key] = this.convertValue(value[key]);
            }
          }
          return { mapValue: { fields: mapValue } };
        }
      default:
        // Return null or throw an error for unsupported types
        return null;
    }
  }

  convertObjectToArray(obj: {
    [x: string]: any;
    hasOwnProperty: (arg0: string) => any;
  }) {
    let array = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        array.push(obj[key]);
      }
    }
    return array;
  }
}
