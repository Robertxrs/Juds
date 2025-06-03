import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IngredientEntry {
  ingredient?: string;
  ingredientName?: string;
  unit: string;
  amount: number;
}

export interface Product {
  id?: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  ingredients?: IngredientEntry[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => products.map(p => ({
        id: (p as any)._id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        status: p.status,
        ingredients: p.ingredients || []
      })))
    );
  }
  addProduct(p: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, p);
  }
  updateProduct(id: string, p: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, p);
  }
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
    updateStock(productId: string, quantityChange: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${productId}/stock`, { change: quantityChange });
  }
}
