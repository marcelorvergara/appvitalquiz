import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertBoxComponent } from '../../../shared/alert-box/alert-box.component';

@Component({
  selector: 'app-entrar',
  standalone: true,
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    AlertBoxComponent,
  ],
})
export class SigninComponent {
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
