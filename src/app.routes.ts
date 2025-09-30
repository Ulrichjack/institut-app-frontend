import { Routes } from '@angular/router';

// --- PUBLIC PAGES ---
import { HomeComponent } from './app/pages/home/home.component';
import { AboutComponent } from './app/pages/about/about.component';
import { FormationsComponent } from './app/pages/formations/formations.component';
import { FormationDetailComponent } from './app/pages/formation-detail/formation-detail.component';
import { GalleryListComponent } from './app/pages/gallery/gallery-list/gallery-list.component';
import { TestimonialCarouselComponent } from './app/pages/testimonial-carousel/testimonial-carousel.component';
import { HeaderComponent } from './app/shared/components/header/header.component';

// --- ADMIN PAGES ---
import { FormationAdminListComponent } from './app/admin/formation-admin-list/formation-admin-list.component';
import { FormationCreationComponent } from './app/admin/formation-creation/formation-creation.component';
import { GalleryImageListAdminComponent } from './app/admin/gallery-image-list-admin/gallery-image-list-admin.component';
import { GalleryImageCreationComponent } from './app/admin/gallery-image-creation/gallery-image-creation.component';

// --- ROUTING ---
export const routes: Routes = [
  // --- PUBLIC ---
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'formations', component: FormationsComponent },
  { path: 'formations/:slug', component: FormationDetailComponent },
  { path: 'gallery', component: GalleryListComponent },
  { path: 'testimonial', component: TestimonialCarouselComponent },


  // --- ADMIN ---
  { path: 'list', component: FormationAdminListComponent }, // Liste admin des formations
  { path: 'creation', component: FormationCreationComponent }, // Création formation
  { path: 'admin/formations/edit/:id', component: FormationCreationComponent }, // Edition formation

  { path: 'gallery-creation', component: GalleryImageCreationComponent }, // Création image galerie
  { path: 'admin/gallery-edit/:id', component: GalleryImageCreationComponent }, // Edition image galerie
  { path: 'admin/gallery-list', component: GalleryImageListAdminComponent }, // Liste admin galerie

  // --- CATCH ALL ---
  { path: '**', redirectTo: '' }
];
