import { Component, inject } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ContextService } from '../../../services/context.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CarouselComponent, InputTextComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  api = inject(ApiService);
  fb = inject(FormBuilder);
  router = inject(Router);
  context = inject(ContextService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.api.userLogin(this.loginForm.value).subscribe(res => {
        this.context.updateLogin(true, res);
        this.router.navigateByUrl("/home");
      });
    } else {
      this.loginForm.reset();
      alert('Dados incorretos!');
    }
  }
}
