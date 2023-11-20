import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStorageService } from '../../../shared/data-storage.service';
import { PatientsDoc } from '../../../shared/models/patient.model';
import { AuthService } from '../../auth/auth.service';
import { getUniqueId } from '../../../utils/utils';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css',
})
export class PatientsListComponent implements OnInit {
  patientList: PatientsDoc[] = [];

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.dataStorageService.fetchPatients().subscribe((patients) => {
      this.patientList = patients.documents;
    });
  }

  requestTest(patient: string) {
    console.log(patient);
    const collectionId = this.authService.getUserData() || '';
    const docId = patient.replaceAll(' ', '_');
    const testId = getUniqueId(1);
    this.dataStorageService
      .patchPatient(collectionId, docId, testId)
      .subscribe((respData) => console.log(respData));
  }
}
