import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import filme from '../../../models/filmeModel';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FilmeService {

  baseUrl = 'http://localhost:3000';
  private tmdbApiUrl = 'https://api.themoviedb.org/3/movie/popular'; // TMDB API endpoint for popular movies // TMDB API endpoint for genres list// TMDB API key
  private tmdbApiKey = environment.tmdbApiKey;
  httpClient = inject(HttpClient);

  constructor() { }

  getFilmes() {
    return this.httpClient.get<filme[]>(this.baseUrl + '/filmes');
  }

  getFilmeById(id: string): Observable<filme> {
    return this.httpClient.get<filme>(`${this.baseUrl}/filmes/${id}`);
  }

  createFilme(filme: filme): Observable<filme> {
    return this.httpClient.post<filme>(this.baseUrl + '/add', filme);
  }

  deleteFilme(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateFilme(filme: filme) {
    return this.httpClient.put<filme>(`${this.baseUrl}/filme/${filme._id}`, filme);
  }

  // Method to fetch popular movies from the TMDB.
  getFilmesFromTMDB(): Promise<any> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.tmdbApiKey}`
      },
    };

    // Adding the `language=pt-BR` parameter to the URL
    const url = `${this.tmdbApiUrl}?language=pt-BR`;

    return fetch(url, options)
      .then((res) => res.json())
      .catch((err) => console.error('Error fetching popular movies from TMDB:', err));
  }

  // Generic method to make requests to the TMDB API using fetch
  getFromTMDB(url: string): Promise<any> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.tmdbApiKey}`, // API token
      },
    };

    // Adding the `language=pt-BR` parameter to the URL
    url = `${url}?language=pt-BR`;

    return fetch(url, options)
      .then((res) => res.json())
      .catch((err) => console.error('Error fetching data from TMDB:', err));
  }
}
