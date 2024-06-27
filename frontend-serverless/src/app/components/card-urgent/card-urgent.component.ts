import { NgStyle } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: '[card-urgent]',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './card-urgent.component.html',
})
export class CardUrgentComponent {
  data = input<HelpParams>();

  bgStyle = computed(() => {
    return { "background-image": `url('${this.data()?.image}')`}
  });
}

type HelpParams = {
  user: { name: string, email: string };
  image: string;
  title: string;
  description: string;
  tag: string;
  totalValue: number;
}

