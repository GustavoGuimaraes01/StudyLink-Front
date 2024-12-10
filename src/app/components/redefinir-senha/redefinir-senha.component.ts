import { Component, OnInit } from '@angular/core';
import { 
  FormControl, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators, 
  ValidatorFn, 
  AbstractControl 
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { RedefinirSenhaService } from '../../services/redefinir-senha/redefinir-senha.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [MatFormFieldModule, CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  estaResetandoSenha: boolean = false;
  emailValido: boolean = false;

  constructor(
    private redefinirSenhaService: RedefinirSenhaService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      novaSenha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmacaoSenha: new FormControl('', [Validators.required])
    }, { validators: this.senhasIguaisValidator() });
  }

  ngOnInit() {
    // Verifica se há um token na URL
    this.token = this.route.snapshot.queryParams['token'];
    
    if (this.token) {
      // Se há token, altera o formulário para redefinição de senha
      this.estaResetandoSenha = true;
    }

    // Adiciona listener para validação de email
    this.resetForm.get('email')?.valueChanges.subscribe(() => {
      this.validarEmail();
    });
  }

  // Validador personalizado para verificar se as senhas são iguais
  senhasIguaisValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const form = control as FormGroup;
      const novaSenha = form.get('novaSenha');
      const confirmacaoSenha = form.get('confirmacaoSenha');

      if (novaSenha && confirmacaoSenha && novaSenha.value !== confirmacaoSenha.value) {
        return { 'senhasNaoConferem': true };
      }
      return null;
    };
  }

  // Método para validar o email em tempo real
  validarEmail() {
    const emailControl = this.resetForm.get('email');
    this.emailValido = emailControl?.valid || false;
  }

  solicitarRedefinicao() {
    if (this.estaResetandoSenha) {
      this.redefinirSenhaComToken();
    } else {
      this.solicitarResetPorEmail();
    }
  }

  private solicitarResetPorEmail() {
    const email = this.resetForm.value.email;
    this.redefinirSenhaService.solicitarRedefinicaoSenha(email).subscribe({
      next: () => {
        this.toastr.success('Instruções para redefinir sua senha foram enviadas para o e-mail fornecido.', 'Sucesso');
        this.estaResetandoSenha = true;
        this.emailValido = false;
      },
      error: (err) => {
        this.toastr.error('Ocorreu um erro ao solicitar a redefinição de senha.', 'Erro');
      }
    });
  }

  private redefinirSenhaComToken() {
    if (this.resetForm.invalid) {
      this.toastr.warning('Por favor, verifique os campos.', 'Atenção');
      return;
    }

    const novaSenha = this.resetForm.get('novaSenha')?.value;

    this.redefinirSenhaService.redefinirSenha(this.token, novaSenha).subscribe({
      next: () => {
        this.toastr.success('Senha redefinida com sucesso.', 'Sucesso');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error('Erro ao redefinir senha. Tente novamente.', 'Erro');
        console.error(err);
      }
    });
  }
}