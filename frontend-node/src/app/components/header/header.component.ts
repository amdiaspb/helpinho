import { Component, inject, signal } from '@angular/core';
import { ContextService } from '../../services/context.service';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  context = inject(ContextService);
  router = inject(Router);
  api = inject(ApiService);
  devInfo: any = signal({});

  logout() {
    this.context.login.set(false);
    localStorage.removeItem("userInfo");
    this.router.navigateByUrl("/home");
  }

  ngOnInit(): void {
    this.api.getDevInfo().subscribe({
      next: res => this.devInfo.set(res),
      error: err => console.log(err)
    })
  }

}
