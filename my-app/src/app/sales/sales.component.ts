import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, ProductService } from '../services/product.service';
import { SaleService, Sale, SaleItem } from '../services/sale.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  saleForm!: FormGroup;
  products: Product[] = [];
  salesHistory: Sale[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private saleService: SaleService
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.loadSalesHistory();
  }
  private initForm(): void {
    this.saleForm = this.fb.group({
      items: this.fb.array([]),
      paymentMethod: ['', Validators.required],
      cashReceived: [0],
      total: [0],
      change: [0]
    });
  }
  get items(): FormArray {
    return this.saleForm.get('items') as FormArray;
  }
  createItem(): FormGroup {
    return this.fb.group({
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0],
      subtotal: [0]
    });
  }
  addProduct(): void {
    this.items.push(this.createItem());
  }
  removeProduct(index: number): void {
    this.items.removeAt(index);
    this.calculateTotal();
  }
  onProductSelected(index: number): void {
    const item = this.items.at(index);
    const productId = item.get('product')?.value;
    const product = this.products.find(p => p.id === productId);

    if (product) {
      item.patchValue({ price: product.price });
      this.updateSubtotal(index);
    } else {
      item.patchValue({ price: 0, subtotal: 0 });
    }
    this.calculateTotal();
  }
  updateSubtotal(index: number): void {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value;
    const price = item.get('price')?.value;

    if (quantity > 0 && price > 0) {
      const subtotal = quantity * price;
      item.patchValue({ subtotal: subtotal });
    }
    this.calculateTotal();
  }
  calculateTotal(): void {
    let total = 0;
    this.items.controls.forEach(item => {
      total += item.get('subtotal')?.value || 0;
    });
    this.saleForm.patchValue({ total: total });
  }
  calculateChange(): void {
    const cashReceived = this.saleForm.get('cashReceived')?.value;
    const total = this.saleForm.get('total')?.value;
    if (cashReceived >= total) {
      this.saleForm.patchValue({ change: cashReceived - total });
    }
  }
  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.items.controls.forEach((item, index) => {
        this.onProductSelected(index);
      });
    });
  }
    loadSalesHistory(): void {
      this.saleService.getSales().subscribe({
        next: sales => {
          console.log('Vendas carregadas:', sales);
          this.salesHistory = sales;
        },
        error: (err) => {
          console.error('Erro ao carregar vendas:', err);
          alert('Erro ao carregar histórico de vendas: ' + err.error?.error || err.message);
        }
      });
    }
  getMaxQuantity(index: number): number {
    const item = this.items.at(index);
    const productId = item.get('product')?.value;
    const product = this.products.find(p => p.id === productId);
    return product ? product.stock : 0;
  }

    onSubmit(): void {
      if (this.saleForm.invalid) return;

      const formValue = this.saleForm.value;
      const saleData: Omit<Sale, '_id'> = {
        items: formValue.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price
        })),
        total: formValue.total,
        paymentMethod: formValue.paymentMethod,
        cashReceived: formValue.paymentMethod === 'Dinheiro' ? formValue.cashReceived : undefined,
        change: formValue.paymentMethod === 'Dinheiro' ? formValue.change : undefined,
        date: new Date()
      };

      this.saleService.createSale(saleData as Sale).subscribe(() => {
        this.saleForm.reset();
        this.items.clear();
        this.loadSalesHistory();
      });
    }
}
