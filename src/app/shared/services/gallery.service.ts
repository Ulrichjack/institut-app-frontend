import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  formation?: {
    id: number;
    nom: string;
    slug: string;
  };
}

export interface GalleryPageResponse {
  content: GalleryImage[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
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

  // NOUVEAU: Récupérer une image par son ID
  getImageById(id: number): Observable<GalleryImage> {
    return this.http.get<GalleryImage>(`${this.apiBaseUrl}/gallery/${id}`);
  }

  // Récupérer une page d'images (pagination)
  getImagesPaged(page: number, size: number): Observable<GalleryPageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<GalleryPageResponse>(`${this.apiBaseUrl}/gallery/paged`, { params });
  }

  // Ajouter une image
  addImage(image: any): Observable<GalleryImage> {
    return this.http.post<GalleryImage>(`${this.apiBaseUrl}/gallery`, image);
  }

  // Recherche par nom de formation (paginée)
  searchImagesByFormationNom(nomFormation: string, page: number = 0, size: number = 12): Observable<GalleryPageResponse> {
    const params = new HttpParams()
      .set('nomFormation', nomFormation)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<GalleryPageResponse>(`${this.apiBaseUrl}/gallery/by-formation-nom-paged`, { params });
  }

  // Filtrage par catégorie
  getImagesByCategory(category: string, page: number = 0, size: number = 12): Observable<GalleryPageResponse> {
    const params = new HttpParams()
      .set('category', category)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<GalleryPageResponse>(`${this.apiBaseUrl}/gallery/by-category`, { params });
  }

  // Supprimer une image (pour admin)
  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/gallery/${id}`);
  }

  // Mettre à jour une image (pour admin)
  updateImage(id: number, image: any): Observable<GalleryImage> {
    return this.http.put<GalleryImage>(`${this.apiBaseUrl}/gallery/${id}`, image);
  }
}
