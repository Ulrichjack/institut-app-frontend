import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CarouselComponent } from "../carousel/carousel.component";
import {  FormationsComponent } from "../formations/formations.component";
import { FormationCreationComponent } from "../../admin/formation-creation/formation-creation.component";
import { HomeFormationsComponent } from "../home-formations/home-formations.component";
import { GalleryHomeComponent } from "../gallery/gallery-home/gallery-home.component";
import { GalleryListComponent } from "../gallery/gallery-list/gallery-list.component";
import { ArgumentInfoComponent } from "../argument-info/argument-info.component";
import { TestimonialCarouselComponent } from "../testimonial-carousel/testimonial-carousel.component";
import { MapComponent } from "../map/map.component";
import { StatsSectionComponent } from "../stats-section/stats-section.component";

@Component({
  selector: 'app-home',
  imports: [CarouselComponent, HomeFormationsComponent, GalleryHomeComponent, TestimonialCarouselComponent, MapComponent, StatsSectionComponent],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
 @ViewChild('statsSection') statsSection!: ElementRef;
  @ViewChildren('stat1, stat2, stat3, stat4') statElements!: QueryList<ElementRef>;

  isVisible = false;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            this.startCountAnimation();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (this.statsSection) {
      observer.observe(this.statsSection.nativeElement);
    }
  }

  private startCountAnimation(): void {
    setTimeout(() => {
      this.statElements.forEach((element, index) => {
        const target = parseInt(element.nativeElement.getAttribute('data-target'));
        this.animateCount(element.nativeElement, target, index * 200);
      });
    }, 500);
  }

  private animateCount(element: HTMLElement, target: number, delay: number): void {
    setTimeout(() => {
      const duration = 2000; // 2 secondes
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Fonction d'easing pour un effet plus naturel
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        const currentValue = Math.floor(startValue + (target - startValue) * easeOutExpo);
        element.textContent = currentValue.toString();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = target.toString();
          element.style.animation = 'countUp 0.3s ease-out';
        }
      };

      animate();
    }, delay);
  }

}
