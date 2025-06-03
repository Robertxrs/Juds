import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
  menuItems = [
    { iconClass: 'bi bi-bar-chart-fill', title: 'Dashboard', path: '' },
    { iconClass: 'bi bi-backpack2', title: 'Produtos', path: '/products' },
    { iconClass: 'bi bi-list', title: 'Ingredientes', path: '/ingredients' },
    { iconClass: 'bi bi-receipt', title: 'Vendas', path: '/sales' },
    { iconClass: 'bi bi-dash-circle-fill', title: 'Controle Financeiro', path: '/expenses' },
  ];


}
