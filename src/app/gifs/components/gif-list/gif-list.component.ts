import { Component, input } from '@angular/core';
import { GifsListItemComponent } from './gif-list-item/gif-list-item.component';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gifs-gif-list',
  standalone: true,
  imports: [GifsListItemComponent],
  templateUrl: './gif-list.component.html',
})
export class GifsListComponent {
  gifs = input.required<Gif[]>();
}
