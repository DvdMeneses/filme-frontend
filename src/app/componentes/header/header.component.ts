import { SharedService } from '../../services/sharedService/shared.service';
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { Component, inject, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, FormsModule, MatSelectModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  genres: any[] = [];
  filmeSharedService = inject(SharedService);
  selectedGenre: number = 0;
  @Output() genreSelected = new EventEmitter<number>(); // Emite o gênero selecionado

  ngOnInit() {
    this.filmeSharedService.loadGenres().subscribe((genres) => {
      this.genres = genres;
    });
  }

  onGenreSelected(selectedGenre: number): void {
    this.filmeSharedService.setSelectedGenre(selectedGenre); // Atualiza o gênero selecionado no serviço
    this.genreSelected.emit(selectedGenre); // Emite o evento de seleção
  }
}
