import { Component, OnInit } from '@angular/core';
import { GalleryService, GalleryImage, GalleryPageResponse } from '../../shared/services/gallery.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-gallery-image-list-admin',
  templateUrl: './gallery-image-list-admin.component.html',
  styleUrl: './gallery-image-list-admin.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class GalleryImageListAdminComponent implements OnInit {
  images: GalleryImage[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  pageSize = 12;
  pageNumber = 0;
  totalPages = 1;
  totalElements = 0;

  constructor(private galleryService: GalleryService, private router: Router) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(page: number = 0) {
    this.isLoading = true;
    this.galleryService.getImagesPaged(page, this.pageSize).subscribe({
      next: (response: GalleryPageResponse) => {
        this.images = response.content || [];
        this.pageSize = response.size || 12;
        this.pageNumber = response.number || 0;
        this.totalPages = response.totalPages || 1;
        this.totalElements = response.totalElements || 0;
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des images.';
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.loadImages(page);
    }
  }

  editImage(image: GalleryImage) {
    // Route vers /admin/gallery-edit/:id
    this.router.navigate(['/admin/gallery-edit', image.id]);
  }

  createImage() {
    this.router.navigate(['/gallery-creation']);
  }

  deleteImage(image: GalleryImage) {
    if (confirm('Supprimer cette image ?')) {
      this.galleryService.deleteImage(image.id).subscribe({
        next: () => this.loadImages(this.pageNumber),
        error: () => alert('Erreur lors de la suppression')
      });
    }
  }
}
