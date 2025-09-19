import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GalleryImage {
  id: number;
  titre: string;
  description: string;
  url: string;
  categorie: string;
  isPublic: boolean;
  formationId?: number;
  dateCreation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private readonly apiBaseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  constructor() {}

  // Récupérer les 9 dernières images pour la home
  getHomeImages(): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(`${this.apiBaseUrl}/gallery/home-images`);
  }

  // Récupérer une page d'images (pagination)
  getImagesPaged(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/gallery/paged?page=${page}&size=${size}`);
    // Le backend renvoie un objet Page avec content, totalPages, etc.
  }

  addImage(image: any) {
  return this.http.post(`${this.apiBaseUrl}/gallery`, image);
}
}
