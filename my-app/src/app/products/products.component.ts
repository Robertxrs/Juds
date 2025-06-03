import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ProductService, Product,IngredientEntry  } from '../services/product.service';
import { IngredientService, Ingredient } from '../services/ingredient.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  form!: FormGroup;
  products: Product[] = [];
  allIngredients: Ingredient[] = [];
  filtered: Product[] = [];
  filter = '';
  loading = false;
  errorMsg = '';
  showForm = false;
  editingId: string | null = null;
  selectedProduct: Product | null = null;

  constructor(
    private fb: FormBuilder,
    private svc: ProductService,
    private ingSvc: IngredientService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadIngredients();
    this.loadProducts();
  }

  viewIngredients(prod: Product) {
    this.selectedProduct = prod;
  }
  closeView() {
    this.selectedProduct = null;
  }
  private initForm() {
    this.form = this.fb.group({
    name:        ['', Validators.required],
    price:       [0, Validators.required],
    stock:       [0, Validators.required],
    status:      ['Ativo', Validators.required],
    ingredients: this.fb.array([])
  });
  }

  get ingArray(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  getIngredientName(entry: IngredientEntry): string {
    if (entry.ingredientName) {
      return entry.ingredientName;
    }
    if (typeof entry.ingredient === 'object' && entry.ingredient !== null) {
      return (entry.ingredient as any).name || '—';
    }
    const ing = this.allIngredients.find(i => i._id === entry.ingredient);
    return ing ? ing.name : '—';
  }
  loadIngredients() {
    this.ingSvc.getAll().subscribe(list => this.allIngredients = list);
  }
  loadProducts() {
    this.loading = true;
    this.svc.getProducts().subscribe({
      next: data => {
        this.products = data.map(p => ({
          id:     (p as any)._id,
          name:   p.name,
          price:  p.price,
          stock:  p.stock,
          status: p.status,
          ingredients: p.ingredients || []
        }));
        this.filtered = this.products;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Erro ao carregar produtos';
        this.loading = false;
      }
    });
  }
  applyFilter() {
    const t = this.filter.trim().toLowerCase();
    this.filtered = this.products.filter(p =>
      p.name.toLowerCase().includes(t)
    );
  }
  openForm(prod?: Product) {
    this.showForm = true;
    this.ingArray.clear();

    if (prod) {
      this.editingId = prod.id!;
      this.form.patchValue({
        name: prod.name,
        price: prod.price,
        stock: prod.stock,
        status: prod.status
      });
      (prod.ingredients || []).forEach(e =>
       this.ingArray.push(this.fb.group({
      ingredient:[null],
      ingredientName:[''],
      unit:['g', Validators.required],
      amount:[0, Validators.required]
    }))
      );
    } else {
      this.editingId = null;
      this.form.reset({
        name:'', price:0, stock:0, status:'Ativo'
      });
    }
  }
  addIngredient() {
  const group = this.fb.group({
    ingredient:    [null],
    ingredientName:[''],
    unit:          ['g', Validators.required],
    amount:        [0, Validators.required]
  });

  group.get('ingredient')!.valueChanges.subscribe(val => {
    group.get('ingredient')!.setValidators(Validators.required);
    group.get('ingredient')!.updateValueAndValidity();
  });
  this.ingArray.push(group);
}
  removeIngredient(i: number) {
    this.ingArray.removeAt(i);
  }
  cancel() {
    this.showForm = false;
    this.editingId = null;
    this.form.reset({ name:'', price:0, stock:0, status:'Ativo' });
    this.ingArray.clear();
  }
  submit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: any = {
      name:v.name,
      price:v.price,
      stock:v.stock,
      status:v.status,
      ingredients: v.ingredients.map((e: any) => ({
        ingredient:e.ingredient,
        ingredientName: e.ingredientName,
        unit:e.unit,
        amount:e.amount
      }))
    };
    const obs = this.editingId
      ? this.svc.updateProduct(this.editingId, payload)
      : this.svc.addProduct(payload);

    obs.subscribe(() => {
      this.loadProducts();
      this.cancel();
    });
  }
  delete(id: string) {
    if (!confirm('Confirmar exclusão?')) return;
    this.svc.deleteProduct(id).subscribe(() => this.loadProducts());
  }
}
