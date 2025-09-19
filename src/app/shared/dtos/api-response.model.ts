
import { HttpStatusCode } from "@angular/common/http";

export interface ApiResponse<T> {
  success: boolean;
  message?: string; // Optionnel car peut être null
  data?: T;       // Optionnel car peut être null en cas d'erreur
  error?: string;   // Optionnel car peut être null en cas de succès
  statusCode: HttpStatusCode | number;
  status: string;
  timestamp: string; // Date et heure sont sérialisées en chaînes de caractères
}
