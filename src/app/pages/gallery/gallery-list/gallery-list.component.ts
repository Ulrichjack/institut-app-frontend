import { Component, OnInit } from '@angular/core';
import { GalleryImage, GalleryService } from '../../../core/services/gallery.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery-list',
  imports:[CommonModule],
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.scss']
})
export class GalleryListComponent implements OnInit {
  images: GalleryImage[] = [];
  page = 0;
  size = 12;
  totalPages = 1;

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.galleryService.getImagesPaged(this.page, this.size).subscribe(res => {
      this.images = res.content;
      this.totalPages = res.totalPages;
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadImages();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadImages();
    }
  }
}
