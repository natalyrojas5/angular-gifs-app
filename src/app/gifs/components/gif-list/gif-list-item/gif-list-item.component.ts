import { Component, input } from '@angular/core';

@Component({
  selector: 'gifs-gif-list-item',
  imports: [],
  templateUrl: './gif-list-item.component.html',
})
export class GifsListItemComponent {
  imageUrl = input.required<string>();
}
