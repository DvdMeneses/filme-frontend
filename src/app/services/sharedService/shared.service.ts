import { Injectable } from '@angular/core';
import { FilmeService } from '../filme/filme.service';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedGenreSource = new BehaviorSubject<number | null>(null);
  private genres: any[] = [];
  private filterFilmsByGenere: any[] = [];
  selectedGenre = this.selectedGenreSource.asObservable();

  constructor(private filmeService: FilmeService) {}

  // Method to load genres.
  loadGenres(): Observable<any[]> {
    return new Observable((observer) => {
      this.filmeService.getFromTMDB('https://api.themoviedb.org/3/genre/movie/list')
        .then((response) => {
          this.genres = response.genres;
          observer.next(this.genres);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // Set the selected genre.
  setSelectedGenre(genreId: number): void {
    this.selectedGenreSource.next(genreId);
  }

  // Method to access genres directly.
  getGenres(): any[] {
    return this.genres;
  }

  // Method to fetch films by genre.
  fetchFilmesFromTmdbByGenre(id: number): void {
    this.filmeService.getFromTMDB('https://api.themoviedb.org/3/discover/movie?language=pt-BR&include_adult=false&with_genres=' + id)
      .then((response) => {
        this.filterFilmsByGenere = response.results;
        console.error(response);
      })
      .catch((error) => {
        console.error('Error fetching films from TMDB:', error);
      });
  }

  // Method to access films filtered by genre
  getFilmesByGenre(): any[] {
    return this.filterFilmsByGenere;
  }
}
