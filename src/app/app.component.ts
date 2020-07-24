import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public movieList = [
                      {id: 1, name: 'Shawshank Redemption'}, 
                      {id: 2, name: 'Green Mile'},
                      {id: 3, name: 'Forrest Gump'},
                      {id: 4, name: 'Shindlers List'},
                      {id: 5, name: '1+1'},
                      {id: 6, name: 'Inception'},
                      {id: 7, name: 'Leon'},
                      {id: 8, name: 'Lion King'},
                      {id: 9, name: 'Fight Club'},
                      {id: 10, name: 'Godfather'},
    ]
}
