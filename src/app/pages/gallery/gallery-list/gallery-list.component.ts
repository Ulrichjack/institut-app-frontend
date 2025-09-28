import { Component, OnInit, OnDestroy } from '@angular/core';
import { GalleryImage, GalleryService } from '../../../shared/services/gallery.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { GalleryModalComponent } from '../gallery-modal/gallery-modal.component';

@Component({
  selector: 'app-gallery-list',
  standalone: true,
  imports: [CommonModule, FormsModule, GalleryModalComponent],
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.scss']
})
export class GalleryListComponent implements OnInit, OnDestroy {
  images: GalleryImage[] = [];
  page = 0;
  size = 15;
  totalPages = 1;
  totalElements = 0;

  // Recherche
  searchQuery: string = '';
  isSearching: boolean = false;
  isLoading: boolean = false;

  // PROPRIÉTÉS POUR LE MODAL
  isModalOpen = false;
  selectedImageIndex = 0;

  // Sujets pour la recherche en temps réel
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription = new Subscription();

  // Filtres
  selectedCategory: string = '';
  categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'FORMATION', label: 'Formations' },
    { value: 'EVENEMENT', label: 'Événements' },
    { value: 'INSTITUT', label: 'Institut' }
  ];

  constructor(private galleryService: GalleryService) {
    // Configuration de la recherche en temps réel avec debounce
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.trim().length === 0) {
          this.isSearching = false;
          this.page = 0;
          return this.galleryService.getImagesPaged(this.page, this.size);
        } else {
          this.isSearching = true;
          this.page = 0;
          return this.galleryService.searchImagesByFormationNom(query.trim(), this.page, this.size);
        }
      })
    ).subscribe({
      next: (res) => {
        this.images = res.content || [];
        this.totalPages = res.totalPages || 1;
        this.totalElements = res.totalElements || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
        this.images = [];
        this.totalPages = 1;
        this.totalElements = 0;
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadImages();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    this.searchSubject.complete();
    // Réactiver le scroll au cas où le modal serait ouvert
    document.body.style.overflow = 'auto';
  }

  // MÉTHODES POUR LE MODAL
  openModal(index: number) {
    this.selectedImageIndex = index;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onModalIndexChange(index: number) {
    this.selectedImageIndex = index;
  }

  // Méthodes existantes
  loadImages(): void {
    this.isLoading = true;
    this.galleryService.getImagesPaged(this.page, this.size).subscribe({
      next: (res) => {
        this.images = res.content || [];
        this.totalPages = res.totalPages || 1;
        this.totalElements = res.totalElements || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des images:', error);
        this.images = [];
        this.isLoading = false;
      }
    });
  }

  onSearchInput(): void {
    this.isLoading = true;
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchInput();
  }

  searchImages(page: number = 0): void {
    if (this.isLoading) return;

    const query = this.searchQuery?.trim();

    if (!query || query.length === 0) {
      this.resetSearch();
      return;
    }

    this.isSearching = true;
    this.isLoading = true;
    this.page = page;

    this.galleryService.searchImagesByFormationNom(query, this.page, this.size).subscribe({
      next: (res) => {
        this.images = res.content || [];
        this.totalPages = res.totalPages || 1;
        this.totalElements = res.totalElements || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
        this.images = [];
        this.totalPages = 1;
        this.totalElements = 0;
        this.isLoading = false;
      }
    });
  }

  filterByCategory(): void {
    if (!this.selectedCategory) {
      this.resetSearch();
      return;
    }

    this.isLoading = true;
    this.page = 0;

    this.galleryService.getImagesByCategory(this.selectedCategory, this.page, this.size).subscribe({
      next: (res) => {
        this.images = res.content || [];
        this.totalPages = res.totalPages || 1;
        this.totalElements = res.totalElements || 0;
        this.isSearching = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du filtrage:', error);
        this.images = [];
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages || this.isLoading) return;

    this.page = page;
    this.isLoading = true;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (this.isSearching && this.searchQuery?.trim()) {
      this.searchImages(page);
    } else if (this.selectedCategory) {
      this.filterByCategory();
    } else {
      this.loadImages();
    }
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.isSearching = false;
    this.page = 0;
    this.loadImages();
  }

  isEventImage(image: GalleryImage): boolean {
    return image.categorie === 'EVENEMENT';
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.label : category;
  }

  get hasResults(): boolean {
    return this.images && this.images.length > 0;
  }

  get showPagination(): boolean {
    return this.hasResults && this.totalPages > 1;
  }

  get searchResultsText(): string {
    if (!this.isSearching) return '';

    const count = this.totalElements;
    const query = this.searchQuery.trim();

    if (count === 0) {
      return `Aucun résultat pour "${query}"`;
    } else if (count === 1) {
      return `1 résultat pour "${query}"`;
    } else {
      return `${count} résultats pour "${query}"`;
    }
  }
}
