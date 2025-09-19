import { Routes } from '@angular/router';
import { HomeComponent } from './app/pages/home/home.component';
import { AboutComponent } from './app/pages/about/about.component';
import { ContactComponent } from './app/pages/contact/contact.component';
import { FormationsComponent } from './app/formations/formations.component';
import { HeaderComponent } from './app/shared/components/header/header.component';
import { FormationCreationComponent } from './app/admin/formation-creation/formation-creation.component';
import { GalleryImageCreationComponent } from './app/admin/gallery-image-creation/gallery-image-creation.component';
import { TestimonialCarouselComponent } from './app/pages/testimonial-carousel/testimonial-carousel.component';

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
  { path: 'creation', component:FormationCreationComponent},
  { path: 'gallery-creation', component:GalleryImageCreationComponent},
  { path: '**', redirectTo: '' }
];
