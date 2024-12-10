import { Component, OnInit } from '@angular/core';
import { LayoutLoginComponent } from '../../components/layout-login/layout-login.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginServiceService } from '../../services/usuarios/login-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LayoutLoginComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatIconModule, MatButtonModule, RouterLink],
  providers: [LoginServiceService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isPasswordVisible: boolean = false;

  constructor(
    private loginService: LoginServiceService, 
    private toastr: ToastrService,
    private router: Router 
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      lembrarDeMim: new FormControl(false) 
    });
  }

  ngOnInit(): void {
    const authToken = this.getCookie('auth-token');
    if (authToken) {
      this.router.navigate(['/home']); 
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
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
      next: (response: any) => {
        const token = response.token; 
        const email = response.email;
        const nomeUsuario = response.nome_usuario;

        if (this.loginForm.value.lembrarDeMim) {
          this.setCookie('auth-token', token, 30); 
          this.setCookie('email', email, 30); 
          this.setCookie('nome_usuario', nomeUsuario, 30); 
        }

        this.router.navigate(['/home']);
      },
      error: () => {
        this.toastr.error("Não foi possível efetuar o login!", "Erro", {
          timeOut: 3000,
          progressBar: true,
        });
      }
    });
  }

  setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); 
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

}
