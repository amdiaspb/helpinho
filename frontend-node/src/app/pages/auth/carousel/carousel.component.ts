import { Component } from '@angular/core';
import { initCarousels } from 'flowbite';

@Component({
  selector: 'login-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.component.html',
})
export class CarouselComponent {
  ngOnInit(): void {
    initCarousels();
  }
}
