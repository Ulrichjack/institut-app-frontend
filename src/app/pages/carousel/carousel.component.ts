import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {

slides = [
  {
    src: '/assets/img/ibe-ceremony.jpg',
    subtitle: 'Institut Beauty\'s Empire',
    title: 'Plus de 1000 Diplômées nous font confiance',
    text: 'Rejoignez notre grande famille de professionnelles. Formation certifiante reconnue dans tout le Cameroun.'
  },
  {
    src: '/assets/img/ibe-formation.jpg',
    subtitle: 'Institut Beauty\'s Empire',
    title: 'Formation 100% Pratique avec Matériel Pro',
    text: 'Apprenez avec les meilleures techniques. Nos formateurs expérimentés vous accompagnent vers l\'excellence.'
  },
  {
    src: '/assets/img/ibe-excellence.jpg',
    subtitle: 'Institut Beauty\'s Empire',
    title: 'IBE : Ils nous ont choisis, pourquoi pas vous ?',
    text: '15 ans d\'excellence en formation beauté. Votre succès professionnel commence ici.'
  }
];
}
