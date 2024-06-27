import { Component, inject } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CarouselComponent, InputTextComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  api = inject(ApiService);
  fb = inject(FormBuilder);
  router = inject(Router);

  signupForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(11)]],
    number: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(11)]],
    password: ['', [Validators.required, Validators.pattern("([a-zA-Z]+[0-9]|[0-9]+[a-zA-Z])[a-zA-Z0-9]*"), Validators.minLength(8)]]
  });

  onSubmit() {
    console.log("SUB");
    if (this.signupForm.valid) {
      console.log("SEND");
      this.api.userSignup(this.signupForm.value).subscribe(res => {
        this.router.navigateByUrl("/login");
      })
    }
  }

}
