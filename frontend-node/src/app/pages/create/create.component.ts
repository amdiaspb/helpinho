import { Component, computed, effect, inject, signal } from '@angular/core';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContextService } from '../../services/context.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [InputTextComponent, HeaderComponent, CurrencyPipe, UpperCasePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styles: `:host { @apply block min-h-screen bg-neutral-100 }`
})
export class CreateComponent {
  api = inject(ApiService);
  fb = inject(FormBuilder);
  router = inject(Router);
  context = inject(ContextService);

  helpForm = this.fb.group({
    title: ['Comprar um PS5', Validators.required],
    image: ['section.png',
      Validators.required
    ],
    description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      Validators.required
    ]
  });

  onSubmit() {
    console.log("SUB");
    if (this.helpForm.valid) {
      console.log("SEND");
      const data = {...this.helpForm.value, tag: this.category(), totalValue: this.value() };
      this.api.createHelp(data).subscribe(_res => {
        this.router.navigateByUrl("/home"); // REDIRECT TO PAGE
      });
    }
  }

  // Category
  categories = ["Jogos", "Saúde", "Música", "Reforma", "Emergência", "Hospitalar"];
  category = signal('Jogos');

  // Goal/Value
  values = [100, 1000, 5000, 10000, 20000, 50000];
  value = signal(1000);

  // Step
  step = signal(0);
  stepInfo = computed(() => this.stepsData[this.step()]);

  stepNext = () => {
    if (this.step() === 0 && this.category() === '') return
    if (this.step() === 1 && (this.helpForm.value.title === '' || this.helpForm.value.image === '')) return;
    if (this.step() === 2 && this.value() === 0) return;
    if (this.step() < 3) {
      this.step.update(v => v+1);
    } else {
      this.onSubmit();
    }
  }
  stepBack = () => {
    if (this.step() > 0) {
      this.step.update(v => v-1);
    } else {
      this.router.navigateByUrl("/home");
    }
  }

  stepsData = [
    {
      subtitle: 'Categoria do helpinho',
      title: 'Em que categoria se encaixa seu helpinho?',
      text: 'Escolha pelo menos uma das categorias abaixo que represente mais o seu helpinho.'
    },
    {
      subtitle: 'Conhecendo o helpinho',
      title: 'Fale um pouco mais',
      text: 'Diga as pessoas mais detalhes dobre helpinho, não economize nas palavras.'
    },
    {
      subtitle: 'Metas do helpinho',
      title: 'Quanto você precisa?',
      text: 'Defina a meta que você quer alcançar com seu helpinho'
    },
    {
      subtitle: 'Revisando',
      title: 'Falta pouco...',
      text: 'Revise se seu helpinho está como você gostaria antes de publica-lo para todos.'
    }
  ]

}
