import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

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

  onSubmit(form: NgForm) {}
}
