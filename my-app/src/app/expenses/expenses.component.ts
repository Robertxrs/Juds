import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IngredientService } from '../services/ingredient.service';
import { ProductService, Product } from '../services/product.service';

interface FinancialData {
  period: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  selectedPeriod: 'week' | 'month' = 'month';
  totalRevenue = 0;
  totalCost = 0;
  profit = 0;
  profitMargin = 0;
  financialData: FinancialData[] = [];
  chartOptions: any = {
    series: [],
    chart: { type: 'area', height: 350, stacked: false },
    colors: ['#4CAF50', '#F44336'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: [], type: 'category' },
    yaxis: {
      title: { text: 'Valor (R$)' },
      labels: {
        formatter: (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      }
    },
    legend: { position: 'top' },
    tooltip: {
      y: {
        formatter: (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      }
    }
  };

  constructor(
    private ingSvc: IngredientService,
    private prodSvc: ProductService
  ) {}

  ngOnInit(): void {
    this.refreshAll();
  }

  changePeriod(period: 'week' | 'month') {
    this.selectedPeriod = period;
    this.refreshAll();
  }

  private async refreshAll() {
    try {
      const [ings, prods] = await Promise.all([
        lastValueFrom(this.ingSvc.getAll()),
        lastValueFrom(this.prodSvc.getProducts())
      ]);

      this.totalCost = ings.reduce((sum: number, i) => sum + (i.cost * i.stock), 0);
      this.totalRevenue = prods.reduce((sum: number, p) => sum + (p.price * p.stock), 0);
      this.profit = this.totalRevenue - this.totalCost;
      this.profitMargin = this.totalRevenue > 0
        ? +(this.profit / this.totalRevenue * 100).toFixed(1)
        : 0;

      this.buildFinancialData();
    } catch (err) {
      console.error('Erro ao carregar dados financeiros', err);
    }
  }

  private buildFinancialData() {
    const isMonthly = this.selectedPeriod === 'month';
    const categories = isMonthly ? ['Jan','Fev','Mar','Abr','Mai','Jun'] : ['Sem 1','Sem 2','Sem 3','Sem 4'];
    const revSlice = this.totalRevenue / categories.length;
    const costSlice = this.totalCost / categories.length;

    this.chartOptions.xaxis.categories = categories;
    this.chartOptions.series = [
      { name: 'Receita', data: Array(categories.length).fill(+revSlice.toFixed(2)) },
      { name: 'Custo', data: Array(categories.length).fill(+costSlice.toFixed(2)) }
    ];

    this.financialData = categories.map(period => ({
      period,
      revenue: revSlice,
      cost: costSlice,
      profit: revSlice - costSlice,
      margin: +((revSlice - costSlice) / revSlice * 100).toFixed(1)
    }));
  }
}
