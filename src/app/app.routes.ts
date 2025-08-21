import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FormationsComponent } from './pages/formations/formations.component';
import { HeaderComponent } from './shared/components/header/header.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'formations', component: FormationsComponent },
  { path: 'text', component: HeaderComponent},
  { path: '**', redirectTo: '' }
];
