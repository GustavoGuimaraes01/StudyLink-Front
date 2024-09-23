import { Component } from '@angular/core';
import { LayoutLoginComponent } from '../../components/layout-login/layout-login.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [LayoutLoginComponent, ReactiveFormsModule],
  providers: [CadastroService],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  cadastroForm!: FormGroup;

  constructor(/*private cadastroServices : CadastroService*/) {
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

    /*enviar() {
      this.cadastroServices.register( this.cadastroForm.value.nome_usuario,this.cadastroForm.value.email, this.cadastroForm.value.senha).subscribe({next:() => console.log("Sucesso"), error: () => console.log("Erro") 
      })
    }*/
}
