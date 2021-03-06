import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicMovieApiService } from '@services/public-movie-api/public-movie-api.service';
import { DataAplicationService } from '@services/data-aplication/data-aplication.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  providers: [PublicMovieApiService]
})
export class SearchResultsComponent implements OnInit {
  //
  public movieTitle: string;
  // Creamos la variable searchTitle con lo que vamos a buscar en la barra de busqueda
  public searchTitle: string;
  // Creamos la variable movieResults sera un array de tipo any donde se guardará la respuesta de la api en formato json
  public movieResult: Array<any> = [];
  // Crearemos una variable result de tipo boolean de manera que cuando el servidor responda con contenido es decir se hayan
  // encontrado sugerencias a la busqueda se pondra a true
  public result: boolean;
  public dataAplication;
  constructor(
    // Creamos la variable activatedRoute de tipo activatedRouter para poder obtener el parametro de la url
    private activatedRoute: ActivatedRoute,
    // Creamos la variable publicapimovie de tipo publicmoviesapiserive para poder acceder a los metodos de la clase apimovieserice
    private publicApiMovies: PublicMovieApiService,
    private router: Router,
    private dataService: DataAplicationService
  ) {
    this.dataService.getData().subscribe(
      result => {
        this.dataAplication = result;
      }
    );
    this.activatedRoute.params.subscribe(
      results => {
        this.searchTitle = results.title;
        // llamamos al metodo searchMovie y le pasamos el resultado del parametro obtenido por la url
        this.searchMovies(this.searchTitle);
      }
    );
  }
  ngOnInit() {
  }
  // Función para buscar la información por titulo en la api
  // Guardamos en el array movieResults todas las ocurrencias formato json
  searchMovies(title: string) {
    this.result = false;
    this.movieResult.splice(0, this.movieResult.length);
    this.publicApiMovies.getMoviesSearch(title).subscribe(
      results => {
        if (results.Response !== false) {
          for (const result of results.Search) {
            if (result.Type === 'movie' && result.Poster !== 'N/A') {
              this.result = true;
              this.movieResult.push(result);
            }
          }
        }
      }
    );
  }
  // Funcion a la que se le pasa por parametros el titulo de la pelicula que en este momento se a
  // seleccionado y redirecciona a la ruta more-info pasandole por url ese titulo de pelicula
  moreInfo(movieTitle) {
    this.movieTitle = movieTitle;
    this.router.navigate(['/more-info/' + this.movieTitle]);
  }
}
