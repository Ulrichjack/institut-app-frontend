import { Component, OnInit } from '@angular/core';
import { GalleryImage, GalleryService } from '../../../core/services/gallery.service';
import { CommonModule } from '@angular/common';
import { GalleryModalComponent } from "../gallery-modal/gallery-modal.component";
import { ArgumentInfo, ArgumentInfoComponent } from '../../argument-info/argument-info.component';

@Component({
  selector: 'app-gallery-home',
   imports: [CommonModule, GalleryModalComponent, ArgumentInfoComponent],
  templateUrl: './gallery-home.component.html',
  styleUrls: ['./gallery-home.component.scss']
})
export class GalleryHomeComponent implements OnInit {
  images: GalleryImage[] = [];

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.galleryService.getHomeImages().subscribe(data => {
      this.images = data;
          console.log(this.images); // Vérifie le champ url

    });
  }

  modalOpen = false;
modalIndex = 0;

openModal(idx: number) {
  this.modalOpen = true;
  this.modalIndex = idx;
}
closeModal() {
  this.modalOpen = false;
}

argumentsList: ArgumentInfo[] = [
  {
    title: 'Devenez expert(e) dans la beauté qui vous passionne',
    description: 'Maîtrisez des compétences recherchées en coiffure, esthétique, maquillage, onglerie ou cosmétique, grâce à nos formations conçues pour révéler votre talent unique.'
  },
  {
    title: 'Programmes sur-mesure pour votre réussite',
    description: 'Composez votre parcours : formation ciblée ou pack complet, avec des modules adaptés à vos ambitions. Multipliez les compétences, multipliez les opportunités !'
  },
  {
    title: 'Des stages, du concret, du réseau',
    description: 'Plongez au cœur du métier : nos cursus incluent des stages auprès de professionnels, pour apprendre sur le terrain et tisser votre réseau.'
  },
  {
    title: 'Investissez sans stress, payez en plusieurs fois',
    description: 'Libérez-vous des contraintes : nos facilités de paiement vous permettent d’apprendre l’esprit tranquille, étalez les frais, démarrez sereinement.'
  },
  {
    title: 'Un avenir qui vous ressemble : salarié(e), entrepreneur, artiste',
    description: 'Ouvrez-vous à tous les horizons : institut, salon, freelance, création d’entreprise… Nos diplômé(e)s sont partout où la beauté s’exprime.'
  },
  {
    title: 'Vous êtes accompagné(e) à chaque étape',
    description: 'Coaching, conseils, suivi personnalisé : notre équipe vous guide, vous motive et vous aide à franchir chaque étape vers votre réussite professionnelle.'
  }
];

}
