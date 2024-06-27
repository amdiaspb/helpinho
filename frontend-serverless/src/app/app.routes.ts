import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { CreateComponent } from './pages/create/create.component';
import { HelpComponent } from './pages/help/help.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'create', component: CreateComponent },
  { path: 'help/:id', component: HelpComponent },
  
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "**", redirectTo: "home", pathMatch: "full" }
];
