import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';

  constructor(private location: Location) {}

  ngOnInit() {
    this.location.subscribe(event => {
      if (event.url === '/') {
        window.location.reload();
      }
    });
  }
}
