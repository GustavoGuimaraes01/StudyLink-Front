import { Component } from '@angular/core';
import { LayoutLoginComponent } from '../../components/layout-login/layout-login.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginServiceService } from '../../services/login-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LayoutLoginComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  providers: [LoginServiceService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  
  constructor(private loginService: LoginServiceService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  enviar() {
     this.loginService.login(this.loginForm.value.email, this.loginForm.value.senha).subscribe({next:() => console.log("Sucesso"), error: () => console.log("Erro") 
     })
  
  }
}
