import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent }     from './products/products.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { SalesComponent } from './sales/sales.component';

const routes: Routes = [
    { path: '', component: DashboardComponent},
  { path: 'products', component: ProductsComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'sales', component: SalesComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
