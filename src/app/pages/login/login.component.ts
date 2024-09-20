import { Component } from '@angular/core';
import { LayoutLoginComponent } from '../../components/layout-login/layout-login.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LayoutLoginComponent,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  
  constructor(){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }
}
