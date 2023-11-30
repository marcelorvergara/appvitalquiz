import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { DataStorageService } from '../../../shared/data-storage.service';
import { AlertBoxComponent } from '../../../shared/alert-box/alert-box.component';
import { ActivatedRoute } from '@angular/router';
import { PatientsDoc } from '../../../shared/models/patient.model';

@Component({
  selector: 'app-cadastra-paciente',
  standalone: true,
  templateUrl: './patient-register.component.html',
  styleUrl: './patient-register.component.css',
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    AlertBoxComponent,
  ],
})
export class PatientRegisterComponent implements OnInit, OnDestroy {
  isLoading = false;
  error = '';

  isEditMode = false;
  patientToEdit?: PatientsDoc;
  nome?: string;
  email?: string;
  phone?: string;
  contactOption = ['Whatsapp', 'SMS'];
  contact? = 'Whatsapp';

  constructor(
    private dataSotrageService: DataStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const patientToEditLocal = this.dataSotrageService.checkPatientToEdit();

    if (patientToEditLocal) {
      this.isEditMode = true;
      this.patientToEdit = patientToEditLocal;
      this.initForm();
    }
  }

  initForm() {
    if (this.isEditMode) {
      this.nome = this.patientToEdit?.fields.nome.stringValue;
      this.email = this.patientToEdit?.fields.email.stringValue;
      this.phone = this.patientToEdit?.fields.phone.stringValue;
      this.contact = this.patientToEdit?.fields.contact.stringValue;
      console.log(this.nome);
    }
  }

  onSubmit(form: NgForm) {
    if (!form.value.email || !form.value.nome || !form.value.phone) {
      this.error = 'Todos os campos são obrigatórios';
      return;
    }

    this.isLoading = true;
    if (this.isEditMode) {
      this.dataSotrageService.editPatient(form.value).subscribe({
        next: (responseData) => {},
        error: (errorMessage) => {
          console.error('Error', errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          this.error = '';
        },
      });
    } else {
      this.dataSotrageService.createPatient(form.value).subscribe({
        next: (responseData) => {},
        error: (errorMessage) => {
          console.error('Error', errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          this.error = '';
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.dataSotrageService.deletePatientToEdit();
  }
}
