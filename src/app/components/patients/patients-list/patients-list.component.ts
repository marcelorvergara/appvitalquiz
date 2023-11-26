import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStorageService } from '../../../shared/data-storage.service';
import { PatientsDoc } from '../../../shared/models/patient.model';
import { AuthService } from '../../auth/auth.service';
import { getUniqueId } from '../../../utils/utils';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { MessageService } from '../../../shared/message.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

const BASE_TEST_URL = 'https://vitalquiz.com/patient-area';

// Helpers
const generateDocId = (patient: string) => patient.replaceAll(' ', '_');
const constructTestUrl = (collectionId: string, respData: any) => {
  const testPart = respData.name.split('/')[6];
  const testNumber = respData.fields.test_number?.stringValue;
  return `${BASE_TEST_URL}/${collectionId}/${testPart}/${testNumber}`;
};

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, RouterModule],
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css',
})
export class PatientsListComponent implements OnInit {
  patientList: PatientsDoc[] = [];
  isLoading = false;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // TODO: error handling
    this.dataStorageService.fetchPatients().subscribe(
      (patients) => {
        this.isLoading = true;
        if (patients) {
          this.patientList = patients.documents;
        }
        this.isLoading = false;
      },
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    );
  }

  // Edit patient
  editPatient(patientName: PatientsDoc) {
    this.dataStorageService.getPatientToEdit(
      patientName.fields.nome.stringValue
    );
    this.router.navigate([
      '/doctor-area/patient-registry/' +
        patientName.fields.nome.stringValue +
        '/edit',
    ]);
  }

  // Update DB wit Test ID and send message to the patient
  requestTest(patient: string) {
    const collectionId = this.authService.getUserData() || '';
    const docId = generateDocId(patient);
    const testId = getUniqueId(1);

    this.dataStorageService
      .patchPatient(collectionId, docId, testId)
      .pipe(
        map((respData) => {
          const testUrl = constructTestUrl(collectionId, respData);
          return { respData, testUrl };
        }),
        switchMap(({ respData, testUrl }) =>
          this.messageService
            .sendMessage(
              respData.fields.nome.stringValue,
              testUrl,
              respData.fields.phone.stringValue,
              respData.fields.contact.stringValue
            )
            .pipe(map((messageResponse) => ({ respData, messageResponse })))
        ),
        catchError((error) => {
          console.error('Error requesting test:', error);
          return of(null); // TODO: improve this error handling
        })
      )
      .subscribe((respData) => {
        if (respData?.messageResponse.errorCode !== null) {
          console.log('Test requested and message sent:', respData);
        } else {
          console.error('Error:', respData.messageResponse.errorMessage);
        }
      });
  }

  patientResults(patient: string) {
    const collectionId = this.authService.getUserData() || '';
    const docId = generateDocId(patient);
    this.dataStorageService
      .getPatientTestResult(collectionId, docId)
      .subscribe((respData) => {
        if (respData) {
          this.router.navigate(['/doctor-area/patient-results']);
        }
      });
  }
}
