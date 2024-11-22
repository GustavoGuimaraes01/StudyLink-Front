import { Component } from '@angular/core';
import { LayoutLoginComponent } from '../../components/layout-login/layout-login.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CadastroService } from '../../services/usuarios/cadastro.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [LayoutLoginComponent, ReactiveFormsModule, CommonModule],
  providers: [CadastroService],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  cadastroForm!: FormGroup;

  constructor(
    private cadastroService: CadastroService, 
    private toastr: ToastrService,
    private router: Router // Injeta o Router
  ) {
    this.cadastroForm = new FormGroup({
      nome_usuario: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmarSenha: new FormControl('', [Validators.required])
    }, { validators: this.passwordsMatchValidator() });
  }

  passwordsMatchValidator(): ValidatorFn {
    return (form: AbstractControl) => {
      const senha = form.get('senha')?.value;
      const confirmarSenha = form.get('confirmarSenha')?.value;
      return senha === confirmarSenha ? null : { mismatch: true };
    };
  }

  enviar() {
    if (this.cadastroForm.invalid) {
      this.toastr.warning("Por favor, preencha os campos corretamente!", "Atenção", {
        timeOut: 3000,
        progressBar: true,
      });
      return;
    }

    this.cadastroService.register(
      this.cadastroForm.value.nome_usuario,
      this.cadastroForm.value.email,
      this.cadastroForm.value.senha
    ).subscribe({
      next: () => {
        this.toastr.success("Cadastro realizado com sucesso!", "Sucesso", {
          timeOut: 3000,
          progressBar: true,
        });
        this.cadastroForm.reset();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastr.error("Não foi possível realizar o cadastro!", "Erro", {
          timeOut: 3000,
          progressBar: true,
        });
      }
    });
  }
}
