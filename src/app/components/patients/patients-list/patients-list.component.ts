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
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css',
})
export class PatientsListComponent implements OnInit {
  patientList: PatientsDoc[] = [];

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.dataStorageService.fetchPatients().subscribe((patients) => {
      this.patientList = patients.documents;
    });
  }

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
              respData.fields.phone.stringValue
            )
            .pipe(map((messageResponse) => ({ respData, messageResponse })))
        ),
        catchError((error) => {
          console.error('Error requesting test:', error);
          return of(null); // TODO: improve this error handling
        })
      )
      .subscribe((respData) => {
        if (respData) {
          console.log('Test requested and message sent:', respData);
        }
      });
  }
}
