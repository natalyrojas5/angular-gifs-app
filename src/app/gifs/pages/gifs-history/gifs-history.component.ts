import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GifsService } from '../../services/gifs.service';
import { GifsListComponent } from "../../components/gif-list/gif-list.component";
@Component({
  selector: 'app-gifs-history',
  standalone: true,
  imports: [GifsListComponent],
  templateUrl: './gifs-history.component.html',
})
export default class GifsHistoryComponent {
  gifService = inject(GifsService);
  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map((params) => params['query'] ?? 'No query')
    )
  );

  gifsByKey = computed(() => this.gifService.getHistoryGifs(this.query()));
}
