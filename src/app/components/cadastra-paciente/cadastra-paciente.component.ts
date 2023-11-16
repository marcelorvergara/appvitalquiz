import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { DataStorageService } from '../../shared/data-storage.service';

@Component({
  selector: 'app-cadastra-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './cadastra-paciente.component.html',
  styleUrl: './cadastra-paciente.component.css',
})
export class CadastraPacienteComponent {
  isLoading = false;
  error = null;

  constructor(private dataSotrageService: DataStorageService) {}

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.dataSotrageService.createPatient(form.value).subscribe();
  }
}
