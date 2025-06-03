import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  cards = [
    { title: 'Cadastro de Ingredientes', description: 'Tabela de Ingredientes', path: '/ingredients' },
    { title: 'Inventário de Bolos', description: 'Registro de Bolos', path: '/products' },
    { title: 'Controle Financeiro', description: 'Visão Geral', path: '/expenses' },
    { title: 'Venda', description: 'Vender Produtos', path: '/sales' }
  ];


}
