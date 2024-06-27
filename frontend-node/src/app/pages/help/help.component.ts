import { CurrencyPipe, NgStyle } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ContextService } from '../../services/context.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [HeaderComponent, CurrencyPipe, RouterLink, NgStyle],
  templateUrl: './help.component.html',
})
export class HelpComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  api = inject(ApiService);
  data = signal<any>(null);
  context = inject(ContextService)

  widthStyle = computed(() => {
    return { "width": (this.data().currentValue / this.data().totalValue) * 100 + '%' }
  });

  ngOnInit(): void {
    this.api.getHelp(this.route.snapshot.params['id']).subscribe({
      next: (res: any) => { this.data.set(res); console.log(res); },
      error: (res: any) => { this.router.navigateByUrl("/home"); console.log(res); },
    })
  }

  donate() {
    const body = { helpId: this.route.snapshot.params['id'], value: getRandomNumber(25, 200) }
    this.api.donate(body).subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });
    this.api.getHelp(this.route.snapshot.params['id']).subscribe({
      next: (res: any) => { this.data.set(res); console.log(res); },
      error: (res: any) => { this.router.navigateByUrl("/home"); console.log(res); },
    })
  }
}

const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}
