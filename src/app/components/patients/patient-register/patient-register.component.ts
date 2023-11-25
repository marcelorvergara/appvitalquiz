import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { DataStorageService } from '../../../shared/data-storage.service';
import { ErrorAlertBoxComponent } from '../../../shared/error-alert-box/error-alert-box.component';

@Component({
  selector: 'app-cadastra-paciente',
  standalone: true,
  templateUrl: './patient-register.component.html',
  styleUrl: './patient-register.component.css',
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    ErrorAlertBoxComponent,
  ],
})
export class PatientRegisterComponent {
  isLoading = false;
  error = '';
  contactOption = ['Whatsapp', 'SMS'];
  contact = 'Whatsapp';

  constructor(private dataSotrageService: DataStorageService) {}

  onSubmit(form: NgForm) {
    if (!form.value.email || !form.value.nome || !form.value.phone) {
      this.error = 'Todos os campos são obrigatórios';
      return;
    }

    this.isLoading = true;
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
