import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStorageService } from '../../shared/data-storage.service';
import { PatientsDoc } from '../../shared/models/patient.model';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css',
})
export class PatientsListComponent implements OnInit {
  patientList: PatientsDoc[] = [];

  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit(): void {
    this.dataStorageService.fetchPatients().subscribe((patients) => {
      this.patientList = patients.documents;
    });
  }
}
