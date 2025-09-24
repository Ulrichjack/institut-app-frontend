import { Routes } from '@angular/router';
import { HomeComponent } from './app/pages/home/home.component';
import { AboutComponent } from './app/pages/about/about.component';
import { FormationsComponent } from './app/pages/formations/formations.component';
import { HeaderComponent } from './app/shared/components/header/header.component';
import { FormationCreationComponent } from './app/admin/formation-creation/formation-creation.component';
import { GalleryImageCreationComponent } from './app/admin/gallery-image-creation/gallery-image-creation.component';
import { TestimonialCarouselComponent } from './app/pages/testimonial-carousel/testimonial-carousel.component';
import { FormationDetailComponent } from './app/pages/formation-detail/formation-detail.component';
import { GalleryListComponent } from './app/pages/gallery/gallery-list/gallery-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'formations', component: FormationsComponent },
  { path: 'service', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: 'price', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: 'team', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: 'testimonial', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: 'gallery', component: GalleryListComponent }, // Remplacer par le bon composant quand créé
  { path: 'appointment', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: '404', component: HomeComponent }, // Remplacer par le bon composant quand créé
  { path: 'text', component: HeaderComponent},
  { path: 'creation', component:FormationCreationComponent},
  { path: 'gallery-creation', component:GalleryImageCreationComponent},
{ path: 'formations/:slug', component: FormationDetailComponent }  ,
{ path: '**', redirectTo: '' }
];
