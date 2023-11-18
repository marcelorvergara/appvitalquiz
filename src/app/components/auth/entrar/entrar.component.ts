import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from '../auth.service';
import { ErrorAlertBoxComponent } from '../../../shared/error-alert-box/error-alert-box.component';

@Component({
  selector: 'app-entrar',
  standalone: true,
  templateUrl: './entrar.component.html',
  styleUrl: './entrar.component.css',
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    ErrorAlertBoxComponent,
  ],
})
export class EntrarComponent {
  isLoading = false;

  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    this.authService.login(email, password).subscribe({
      next: (responseData) => {
        this.router.navigate(['/doctor-area/patients-list']);
      },
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

    form.reset();
  }
}
