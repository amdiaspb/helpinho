import { Component, computed, inject, signal } from '@angular/core';
import { InputTextComponent } from '../../../components/input-text/input-text.component';
import { CardComponent } from '../../../components/card/card.component';
import { CardUrgentComponent } from '../../../components/card-urgent/card-urgent.component';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'home-main',
  standalone: true,
  imports: [InputTextComponent, CardComponent, CardUrgentComponent, FormsModule, AsyncPipe],
  templateUrl: './main.component.html',
  styles: `
    :host { 
      @apply block p-28 px-32
    }

    .test {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(385px, max-content));
      grid-gap: 32px;
      justify-content: center;
      padding: initial;
    }
  `
})
export class MainComponent {
  categories = ["Todas as categorias", "Jogos", "Saúde", "Música", "Reforma", "Emergência", "Hospitalar"];
  show = signal(false);
  category = signal<string>('');
  search = signal<string>('');
  api = inject(ApiService);
  router = inject(Router);

  //helps$!: Observable<any[]>;
  helps = signal<any[]>([]);
  helpsFiltered = computed(() => {
    if (this.category() === "" || this.category() === "Todas as categorias") {
      return this.helps().filter(h => h.title.toLowerCase().includes(this.search().toLowerCase()));
    }

    return this.helps().filter(h => {
      return (h.tag === this.category() &&
        h.title.toLowerCase().includes(this.search().toLowerCase())
      );
    });
  });

  ngOnInit(): void {
    //this.helps$ = this.api.getAllHelps();
    this.api.getAllHelps().subscribe({
      next: (res) => { 
        console.log(res)
        const formated = res.reduce((obj, item) => {
          if (!obj[item.PK]) obj[item.PK] = { helpDonated: { images: [], len: 0 } };

          if (item.SK.includes("Data")) {
            const { id, image, title, description, tag, totalValue } = item;
            obj[item.PK] = {...obj[item.PK], id, image, title, description, tag, totalValue };
          }
          if (item.SK.includes("User") && item.SK.split("#").length === 2) { // USER
            const { name, email, image } = item;
            obj[item.PK].user = { name, email, image };
          }
          if (item.SK.split("#").length === 3) { // DONATION
            obj[item.PK].helpDonated.images.push(item.image);
            obj[item.PK].helpDonated.len++;
          }
          return obj;
        }, {});
        console.log(formated);
        this.helps.set(Object.values(formated));
      }
    })
  }

  toogleShow = () => {
    this.show.update(v => !v);
  }

  selectCategory = (value: string) => {
    this.show.set(false);
    this.category.set(value);
  }

  toHelpPage(id: string) {
    this.router.navigateByUrl('/help/' + id);
  }
}
