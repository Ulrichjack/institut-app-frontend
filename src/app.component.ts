import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./app/shared/components/header/header.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./app/shared/components/footer/footer.component";
import { HomeFormationsComponent } from "./app/pages/home-formations/home-formations.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, CommonModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'institue';
   isModalOpen = false;

constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }


  ngOnInit(): void {
    // Initialization code
  }

  ngAfterViewInit(): void {
    // Enable back-to-top button functionality
    const backToTop = document.querySelector('.back-to-top') as HTMLElement;

    if (backToTop) {
      // Initially hide the button
      backToTop.style.display = 'none';

      // Show button when scrolling down
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTop.style.display = 'flex';
        } else {
          backToTop.style.display = 'none';
        }
      });

      // Scroll to top when clicked
      backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
}
