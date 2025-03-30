import { Component, inject, signal } from '@angular/core';
import { GifsListComponent } from '../../components/gif-list/gif-list.component';
import { GifsService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [GifsListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {
  gifService = inject(GifsService);
  gifs = signal<Gif[]>([]);
  onSearch(query: string) {
    this.gifService.searchGifs(query).subscribe((response) => {
      this.gifs.set(response);
    });
  }
}
