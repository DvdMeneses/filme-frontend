import { Component, inject, AfterViewChecked, OnInit, OnChanges } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';

import { FilmeService } from '../../services/filme/filme.service';
import { SharedService } from '../../services/sharedService/shared.service';
import Filme from '../../../models/filmeModel';

@Component({
  selector: 'app-list-filmes',
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
  templateUrl: './list-filmes.component.html',
  styleUrl: './list-filmes.component.css'
})
export class ListFilmesComponent implements OnInit, OnChanges, AfterViewChecked {
  FilmeService = inject(FilmeService);
  filmeSharedService = inject(SharedService);

  filmes: Filme[] = [];
  filteredFilmes: Filme[] = [];
  searchTerm: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.FilmeService.getFilmes().subscribe((result) => {
      this.filmes = result;
      this.filteredFilmes = result;
    });
  }

  ngOnChanges() {
    this.filterFilmes();
  }

  ngAfterViewChecked() {
    this.route.params.subscribe(params => {
      const filmeId = params['id'];
      if (filmeId) {
        this.scrollToFilme(filmeId);
      }
    });
  }

  filterFilmes() {
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    this.filteredFilmes = this.filmes.filter(
      (filme) =>
        filme.title.toLowerCase().includes(lowerCaseTerm) ||
        filme.year.toString().includes(this.searchTerm) ||
        filme.score.toString().includes(this.searchTerm)
    );
  }

  scrollToFilme(filmeId: string): void {
    const element = document.getElementById(filmeId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  editFilme(filme: Filme) {
    this.router.navigate([`filme/${filme._id}`], { state: { filmeData: filme } });
  }

  deleteFilme(id: string) {
    this.FilmeService.deleteFilme(id).subscribe(() => {
      this.filmes = this.filmes.filter(filme => filme._id !== id);
      this.filteredFilmes = this.filmes.filter(filme => filme._id !== id);
    });
  }
}
