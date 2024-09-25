import { Component, ɵUSE_RUNTIME_DEPS_TRACKER_FOR_JIT } from '@angular/core';
import { LayoutLoginComponent } from '../../components/layout-login/layout-login.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginServiceService } from '../../services/login-service.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LayoutLoginComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule],
  providers: [LoginServiceService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  
  constructor(private loginService: LoginServiceService, private toastr: ToastrService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  enviar() {
    if (this.loginForm.invalid) {
      this.toastr.warning("Por favor, preencha os campos corretamente!", "Atenção", {
        timeOut: 3000,
        progressBar: true,
      });
      return;
    }
  
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.senha).subscribe({
      next: () => {
        this.toastr.success("Login feito com sucesso!", "Sucesso", {
          timeOut: 3000,
          progressBar: true,
        });
      },
      error: () => {
        this.toastr.error("Não foi possível efetuar o login!", "Erro", {
          timeOut: 3000,
          progressBar: true,
        });
      }
    });
  }
  
  
}
