import { Component, OnInit } from '@angular/core';
import { Ingredient, IngredientService } from '../services/ingredient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {
  ingredients: Ingredient[] = [];
  filtered: Ingredient[] = [];
  filter = '';
  loading = false;
  errorMsg = '';
  showForm = false;
  form!: FormGroup;
  editingId: string | null = null;

  constructor(
    private svc: IngredientService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.load();
  }
  initForm() {
    this.form = this.fb.group({
      name:  ['', Validators.required],
      unit:  ['', Validators.required],
      cost:  [0, Validators.required],
      stock: [0, Validators.required],
    });
  }
  load() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: data => {
        this.ingredients = data;
        this.filtered = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Erro ao carregar ingredientes';
        this.loading = false;
      }
    });
  }
  applyFilter() {
    const t = this.filter.trim().toLowerCase();
    this.filtered = this.ingredients.filter(i =>
      i.name.toLowerCase().includes(t) ||
      i.unit.toLowerCase().includes(t)
    );
  }
  openForm() {
    this.showForm = true;
  }
  submit() {
    if (this.form.invalid) return;
    const val = this.form.value as Ingredient;

    const obs = this.editingId
      ? this.svc.update(this.editingId, val)
      : this.svc.create(val);

    obs.subscribe({
      next: () => {
        this.editingId = null;
        this.form.reset({ name:'', unit:'', cost:0, stock:0 });
        this.load();
      },
      error: () => (this.errorMsg = 'Erro ao salvar ingrediente')
    });
  }
  edit(item: Ingredient) {
    this.openForm();
    this.editingId = item._id!;
    this.form.setValue({
      name: item.name,
      unit: item.unit,
      cost: item.cost,
      stock: item.stock
    });
  }
  remove(id: string) {
    this.svc.delete(id).subscribe({
      next: () => this.load(),
      error: () => (this.errorMsg = 'Erro ao excluir ingrediente')
    });
  }
  cancel() {
        this.showForm = false;
    this.editingId = null;
    this.form.reset({ name:'', unit:'', cost:0, stock:0 });
  }
}
