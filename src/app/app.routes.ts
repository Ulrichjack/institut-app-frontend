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
  { path: 'service', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: 'price', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: 'team', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: 'testimonial', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: 'gallery', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: 'appointment', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: '404', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: 'text', component: HeaderComponent},
  { path: '**', redirectTo: '' }
];
