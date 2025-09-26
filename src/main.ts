import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { register } from 'swiper/element/bundle';

// Register Swiper custom elements
register();

// Initialiser AOS si disponible
declare var AOS: any;
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
