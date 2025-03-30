import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mappers/gif.mapper';
import { Observable, map, tap } from 'rxjs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem('gifs') ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);

  return gifs;
};

@Injectable({ providedIn: 'root' })
export class GifsService {
  private http = inject(HttpClient);
  private trendingPage = signal(0);

  trendingsGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal<boolean>(false);
  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];

    for (let i = 0; i < this.trendingsGifs().length; i += 3) {
      groups.push(this.trendingsGifs().slice(i, i + 3));
    }

    return groups;
  });

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem('gifs', historyString);
  });

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    if (this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    const params = {
      api_key: environment.giphyApiKey,
      limit: 20,
      offset: this.trendingPage() * 20,
    };

    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params,
      })
      .subscribe((response) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(response.data);
        this.trendingGifsLoading.set(false);
        this.trendingsGifs.update((currentGifs) => [...currentGifs, ...gifs]);
        this.trendingPage.update((currentPage) => currentPage + 1);
      });
  }

  searchGifs(query: string): Observable<Gif[]> {
    const params = {
      api_key: environment.giphyApiKey,
      limit: 20,
      q: query,
    };
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params,
      })
      .pipe(
        map(({ data }) => data),
        map((gifs) => GifMapper.mapGiphyItemsToGifArray(gifs)),
        tap((items) =>
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLowerCase()]: items,
          }))
        )
      );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
