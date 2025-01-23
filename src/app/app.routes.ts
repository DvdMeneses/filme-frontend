import { FormFilmeComponent } from './componentes/addFilme/form-filme.component';
import { Routes } from '@angular/router';
import { FilmeComponent } from './componentes/filme/filme.component';
import { ListFilmesComponent } from './componentes/listFilmes/list-filmes.component';

export const routes: Routes = [
  { path: '', component: FilmeComponent },
  { path: 'meusFilmes', component: ListFilmesComponent },
  { path: 'meusFilmes/:id', component: ListFilmesComponent },
  { path: 'filmes/:id', component: FilmeComponent },
  { path: 'add', component: FormFilmeComponent },
  { path: 'filme/:id', component: FormFilmeComponent }
];
