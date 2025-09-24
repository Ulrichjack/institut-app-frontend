import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormationCreateDto } from '../dtos/formation-create-dto.model';
import { Observable } from 'rxjs';
import { FormationListDto } from '../dtos/formation-list-dto.model';
import { FormationDetailDto } from '../dtos/formation-detail-dto.model';
import { ApiResponse } from '../dtos/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FormationService {

  private readonly apiBaseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  constructor() { }

 createFormation(formationData: FormationCreateDto, adminCreateur: string): Observable<ApiResponse<FormationDetailDto>> {
  return this.http.post<ApiResponse<FormationDetailDto>>(
    `${this.apiBaseUrl}/formations`, // <-- CORRECT ENDPOINT
    formationData,
    { headers: { 'X-Admin-User': adminCreateur } }
  );
}

    getFormationsList(page: number = 0, size: number = 10, sortBy: string = 'dateCreation', sortOrder: string = 'desc'): Observable<ApiResponse<FormationListDto[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    return this.http.get<ApiResponse<FormationListDto[]>>(`${this.apiBaseUrl}/formations`, { params });
  }

   getFormationDetails(slug: string): Observable<FormationDetailDto> {
    return this.http.get<FormationDetailDto>(`${this.apiBaseUrl}/formations/details/${slug}`);
  }

searchFormations(q: string, page: number = 0, size: number = 12): Observable<ApiResponse<any>> {
  let params = new HttpParams()
    .set('q', q || '')
    .set('page', page.toString())
    .set('size', size.toString());

  // CORRECTION : Utiliser l'URL complète avec apiBaseUrl
  return this.http.get<ApiResponse<any>>(`${this.apiBaseUrl}/formations/search`, { params });
}

getFormationDetailBySlug(slug: string) {
  return this.http.get<ApiResponse<any>>(`${this.apiBaseUrl}/formations/slug/${slug}`);
}




}
