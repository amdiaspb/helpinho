import { Component, input } from '@angular/core';

@Component({
  selector: '[card]',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
})
export class CardComponent {
  data = input<HelpParams>();
  
}

type HelpParams = {
  user: { name: string, email: string, image: string };
  helpDonated: { images: string[], len: number };
  id: string;
  image: string;
  title: string;
  description: string;
  tag: string;
  totalValue: number;
}
