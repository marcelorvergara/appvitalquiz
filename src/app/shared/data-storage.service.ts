import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environmets';
import { Patient, Patients } from './models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private databaseId = '(default)';
  private collectionPath = 'patients';
  private url = `https://firestore.googleapis.com/v1/projects/${environment.projectId}/databases/${this.databaseId}/documents/${this.collectionPath}`;

  constructor(private http: HttpClient) {}

  createPatient(data: Patient) {
    return this.http.post(
      this.url + '?documentId=' + data.nome.replace(' ', '_'),
      {
        fields: this.convertToFirestoreFormat(data),
      }
    );
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
