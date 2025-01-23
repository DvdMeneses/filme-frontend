import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CarouselModule } from 'primeng/carousel';

import { FilmeService } from '../../services/filme/filme.service';
import { SharedService } from '../../services/sharedService/shared.service';

import Filme from '../../../models/filmeModel';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-filme',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    FormsModule,
    CarouselModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './filme.component.html',
  styleUrls: ['./filme.component.css'],
})
export class FilmeComponent {
  genres: any[] = [];
  filmesTMDB: any[] = [];
  groupedMovies: { [genreId: number]: any[] } = {};
  genresTMDB: any[] = [];
  selectedGenre: number = 0;
  filmes: Filme[] = [];
  filmeAtual: Filme | null = null;
  responsiveOptions: any[] | undefined;

  // Font Awesome icons.
  faStar = faStar;
  faStarHalfAlt = faStarHalfAlt;
  faStarOutline = faStarOutline;

  // Injected services.
  FilmeService = inject(FilmeService);
  filmeSharedService = inject(SharedService);

  // Output event emitter
  @Output() genresLoaded = new EventEmitter<any[]>();

  ngOnInit() {
    // Load movies and genres on initialization.
    this.loadFilmes();
    this.loadGenres();
    this.listenToGenreChanges();
  }

  // Load movies from the service.
  loadFilmes() {
    this.FilmeService.getFilmes().subscribe((result) => {
      this.filmes = result;
    });
  }

  // Load genres from the shared service.
  loadGenres() {
    this.filmeSharedService.loadGenres().subscribe((genres) => {
      this.genres = genres;
      this.fetchMoviesByGenres();
    });
  }

  // Listen for genre changes and update the movie list.
  listenToGenreChanges() {
    this.filmeSharedService.selectedGenre.subscribe((genreId) => {
      if (genreId !== null) {
        this.fetchFilmesFromTmdbByGenere(genreId);
      }
    });
  }

  onGenreSelected(genreId: number): void {
    this.selectedGenre = genreId;
    this.fetchFilmesFromTmdbByGenere(genreId);
  }

  calculateStars(voteAverage: number) {
    const fullStars = Math.floor(voteAverage / 2);
    const halfStar = voteAverage % 2 >= 1;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return { fullStars, halfStar, emptyStars };
  }

  getFilme(id: string) {
    this.FilmeService.getFilmeById(id).subscribe((filme) => {
      this.filmeAtual = filme;
    });
  }

  deleteFilme(id: string) {
    this.FilmeService.deleteFilme(id).subscribe(() => {
      this.filmes = this.filmes.filter((filme) => filme._id !== id);
    });
  }

  openTrailer(trailerUrl: string): void {
    window.open(trailerUrl, '_blank');
  }

  fetchFilmesFromTMDB() {
    this.FilmeService.getFilmesFromTMDB()
      .then((response) => {
        this.filmesTMDB = response.results;
      })
      .catch((error) => {
        console.error('Error fetching movies from TMDB:', error);
      });
  }

  fetchMoviesByGenres() {
    this.genres.forEach((genre) => {
      this.FilmeService.getFromTMDB(
        `https://api.themoviedb.org/3/discover/movie?language=pt-BR&include_adult=false&with_genres=${genre.id}`
      )
        .then((response) => {
          this.groupedMovies[genre.id] = response.results || [];
        })
        .catch((error) => {
          console.error(`Error fetching movies for genre ${genre.name}:`, error);
        });
    });
  }

  fetchFilmesFromTmdbByGenere(id: number) {
    this.FilmeService.getFromTMDB('https://api.themoviedb.org/3/discover/movie?language=pt-BR&include_adult=false&with_genres=' + id)
      .then((response) => {
        this.filmesTMDB = response.results;
      })
      .catch((error) => {
        console.error('Error fetching movies from TMDB:', error);
      });
  }

  // Method to get the color associated with a genre.
  getGenreColor(genreName: string): string {
    switch (genreName.toLowerCase()) {
      case 'ação': return 'rgb(229, 9, 20)';
      case 'aventura': return 'rgb(13, 103, 6)';
      case 'animação': return 'rgb(194, 4, 90)';
      case 'comédia': return 'rgb(235, 97, 11)';
      case 'crime': return 'rgb(0, 0, 0)';
      case 'documentário': return 'rgb(7, 110, 227)';
      case 'drama': return 'rgb(94, 4, 4)';
      case 'família': return 'rgb(195, 179, 35)';
      case 'fantasia': return 'rgb(114, 10, 194)';
      case 'história': return 'rgb(100, 52, 7)';
      case 'terror': return 'rgba(128, 0, 32, 1)';
      case 'música': return 'rgb(255, 165, 0)';
      case 'mistério': return 'rgb(45, 0, 75)';
      case 'romance': return 'rgb(202, 62, 132)';
      case 'ficção científica': return 'rgb(12, 171, 171)';
      case 'cinema tv': return 'rgb(181, 159, 39)';
      case 'thriller': return 'rgb(0, 0, 128)';
      case 'guerra': return 'rgb(25, 116, 25)';
      case 'faroeste': return 'rgb(139, 69, 19)';
      default: return '#9e9e9e';  // Default color for other genres
    }
  }
}
