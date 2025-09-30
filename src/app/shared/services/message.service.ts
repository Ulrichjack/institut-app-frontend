import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NewsletterSubscribeDto } from '../dtos/NewsletterSubscribeDto';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly apiBaseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  preInscription(dto: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/messages/pre-inscription`, dto);
  }
  contact(dto: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/messages/contact`, dto);
  }

  subscribe(dto: NewsletterSubscribeDto): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/newsletter/subscribe`, dto, { responseType: 'text' });
  }
}
