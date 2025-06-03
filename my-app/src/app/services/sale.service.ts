import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // <-- aqui
import { map, catchError } from 'rxjs/operators';

export interface SaleItem {
  product: {
    _id: string;
    name: string;
  };
  quantity: number;
  price: number;
}

export interface Sale {
  _id?: string;
  items: SaleItem[];
  total: number;
  paymentMethod: 'Dinheiro' | 'Cartão' | 'Pix';
  cashReceived?: number;
  change?: number;
  date: Date;
}

@Injectable({ providedIn: 'root' })
export class SaleService {
  private apiUrl = 'http://localhost:3000/sales';

  constructor(private http: HttpClient) {}

  createSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(this.apiUrl, sale);
  }

  getSales(): Observable<Sale[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(sales => sales.map(sale => ({
        ...sale,
        date: new Date(sale.date),
        items: sale.items.map((item: any) => ({
          ...item,
          product: {
            _id: item.product?._id || 'deleted',
            name: item.product?.name || 'Produto não encontrado'
          }
        }))
      }))),
      catchError(err => {
        console.error('Erro ao carregar vendas:', err);
        return of([]);
      })
    );
  }
}
