import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ContextService } from '../../services/context.service';
import { ApiService } from '../../services/api.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, CurrencyPipe, RouterLink, MainComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styles: `
    .bg-mask {
      mask-image: linear-gradient(300deg,rgba(0,0,0,1),rgba(0,0,0,1))
    }
  `
})
export class HomeComponent {
  context = inject(ContextService);
  api = inject(ApiService);
  userInfo: any = signal({});

  ngOnInit(): void {
    this.api.getUserInfo().subscribe(res => {
      this.userInfo.set(res);
      console.log(res);
  });
  }
  
}

