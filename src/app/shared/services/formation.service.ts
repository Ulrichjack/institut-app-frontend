import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormationCreateDto } from '../dtos/formation-create-dto.model';
import { Observable } from 'rxjs';
import { FormationListDto } from '../dtos/formation-list-dto.model';
import { FormationDetailDto } from '../dtos/formation-detail-dto.model';
import { ApiResponse } from '../dtos/api-response.model';
import { FormationSimpleDto } from '../dtos/formationSimpleDto';
import { FormationAdminDto } from '../dtos/FormationAdminDto';
import { FormationUpdateDto } from '../dtos/FormationUpdateDto';

// Interface pour la pagination Spring
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FormationService {

  private readonly apiBaseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  constructor() { }

  createFormation(formationData: FormationCreateDto, adminCreateur: string): Observable<ApiResponse<FormationDetailDto>> {
    return this.http.post<ApiResponse<FormationDetailDto>>(
      `${this.apiBaseUrl}/formations`,
      formationData,
      { headers: { 'X-Admin-User': adminCreateur } }
    );
  }

  // ✅ CORRIGÉ - Retourne PageResponse au lieu de tableau
  getFormationsList(page: number = 0, size: number = 10, sortBy: string = 'dateCreation', sortOrder: string = 'desc'): Observable<ApiResponse<PageResponse<FormationListDto>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    return this.http.get<ApiResponse<PageResponse<FormationListDto>>>(`${this.apiBaseUrl}/formations`, { params });
  }

  getFormationDetails(slug: string): Observable<FormationDetailDto> {
    return this.http.get<FormationDetailDto>(`${this.apiBaseUrl}/formations/details/${slug}`);
  }

  // ✅ CORRIGÉ - Retourne PageResponse au lieu de any
  searchFormations(q: string, page: number = 0, size: number = 12): Observable<ApiResponse<PageResponse<FormationListDto>>> {
    let params = new HttpParams()
      .set('q', q || '')
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<FormationListDto>>>(`${this.apiBaseUrl}/formations/search`, { params });
  }

  // ✅ CORRIGÉ - Retourne FormationDetailDto au lieu de any
  getFormationDetailBySlug(slug: string): Observable<ApiResponse<FormationDetailDto>> {
    return this.http.get<ApiResponse<FormationDetailDto>>(`${this.apiBaseUrl}/formations/slug/${slug}`);
  }

  // ✅ OK - Pas de pagination ici, retourne un tableau simple
  getFormationsForSelection(): Observable<ApiResponse<FormationSimpleDto[]>> {
    return this.http.get<ApiResponse<FormationSimpleDto[]>>(
      `${this.apiBaseUrl}/formations/selection`
    );
  }

  // ✅ CORRIGÉ - Utilise PageResponse
  getAdminFormations(page: number = 0, size: number = 20, sortBy: string = 'dateCreation', sortOrder: string = 'desc'): Observable<ApiResponse<PageResponse<FormationAdminDto>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortOrder);

    return this.http.get<ApiResponse<PageResponse<FormationAdminDto>>>(
      `${this.apiBaseUrl}/formations/admin`, { params }
    );
  }

  // ✅ CORRIGÉ - Retourne FormationDetailDto au lieu de any
  getFormationById(id: number): Observable<ApiResponse<FormationDetailDto>> {
    return this.http.get<ApiResponse<FormationDetailDto>>(`${this.apiBaseUrl}/formations/${id}`);
  }

  // ✅ CORRIGÉ - Retourne FormationDetailDto au lieu de any
  updateFormation(id: number, updateData: FormationUpdateDto, adminModificateur: string): Observable<ApiResponse<FormationDetailDto>> {
    return this.http.put<ApiResponse<FormationDetailDto>>(
      `${this.apiBaseUrl}/formations/${id}`,
      updateData,
      { headers: { 'X-Admin-User': adminModificateur } }
    );
  }

  // ✅ CORRIGÉ - Retourne ApiResponse au lieu de Observable vide
  deleteFormation(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiBaseUrl}/formations/${id}`);
  }
}
