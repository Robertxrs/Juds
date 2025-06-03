import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Ingredient {
  _id?: string;
  name: string;
  unit: string;
  cost: number;
  stock: number;
}
@Injectable({ providedIn: 'root' })
export class IngredientService {
  private apiUrl = 'http://localhost:3000/ingredients';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.apiUrl);
  }

  create(item: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(this.apiUrl, item);
  }

  update(id: string, item: Partial<Ingredient>): Observable<Ingredient> {
    return this.http.put<Ingredient>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
