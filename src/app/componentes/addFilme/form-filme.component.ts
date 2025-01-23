import { EmailService } from './../../services/email/email.service';
import { FilmeService } from '../../services/filme/filme.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common'; // Importing CommonModule
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-filme',
  templateUrl: './form-filme.component.html',
  imports: [ReactiveFormsModule, FontAwesomeModule, CommonModule],
  styleUrls: ['./form-filme.component.css']
})
export class FormFilmeComponent implements OnInit {

  // Default image URL for the movie poster in case of image load failure
  defaultImageUrl = 'https://i.pinimg.com/736x/53/71/15/5371158587b9381f6703e6a753db657f.jpg';

  movieForm!: FormGroup;  // Form group for the movie data
  faStar = faStar;
  faStarHalfAlt = faStarHalfAlt;
  faStarOutline = faStarOutline;
  errorMessage: string = ''; // To hold error messages
  successMessage: string = ''; // To hold success messages

  constructor(private fb: FormBuilder, private filmeService: FilmeService, private router: Router, private emailService: EmailService ) {}

  // Handle image loading error by setting a default image
  onImageError(event: any): void {
    event.target.src = this.defaultImageUrl;
  }

  // Initialize the form on component load
  ngOnInit() {
    const filmeData = history.state.filmeData;

    if (filmeData) {
      // Populate the form with movie data if available
      this.movieForm = this.fb.group({
        _id: [filmeData._id],  // Movie ID for editing
        title: [filmeData.title, Validators.required],
        description: [filmeData.description, Validators.required],
        score: [filmeData.score, [Validators.required, Validators.min(0), Validators.max(10)]],
        image_url: [filmeData.image_url, Validators.required],
        trailer: [filmeData.trailer, Validators.required],
        year: [filmeData.year, [Validators.required, Validators.pattern('^[0-9]{4}$')]]
      });
    } else {
      // Initialize an empty form for adding a new movie
      this.movieForm = this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        score: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
        image_url: ['', Validators.required],
        trailer: ['', Validators.required],
        year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]]
      });
    }
  }

  // Handle form submission
  onSubmit() {
    if (this.movieForm.valid) {
      const movieData = this.movieForm.value;
      if (movieData._id) {  // Check if the form contains an ID for updating
        this.filmeService.updateFilme(movieData).subscribe(
          (response) => {
            this.successMessage = 'Filme atualizado com sucesso!'; // Success message
            this.router.navigate(['/']);
          },
          (error) => {
            this.errorMessage = 'Ocorreu um erro ao atualizar o filme. Tente novamente mais tarde.'; // Error message
          }
        );
      } else {
        // Create a new movie if there's no ID
        this.filmeService.createFilme(movieData).subscribe(
          (response) => {
            let email = {email: "david.meneses.cc@gmail.com"}
            this.successMessage = 'Filme cadastrado com sucesso!'; // Success message
            this.emailService.sendEmail('http://localhost:3000/sendMail',email).subscribe((data) =>{
              console.log(`Email enviado para ${email.email}`)
            });
            this.router.navigate(['/']);
          },
          (error) => {
            this.errorMessage = 'Ocorreu um erro ao cadastrar o filme. Tente novamente mais tarde.'; // Error message
          }
        );
      }
    }
  }

  // Validate the movie score input (ensuring it's between 0 and 10)
  validateScore(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);

    if (value > 10) {
      value = 10;
    } else if (value < 0) {
      value = 0;
    }

    input.value = value.toString();
    this.movieForm.get('score')?.setValue(value);
  }

  // Calculate the number of full, half, and empty stars based on the score
  calculateStars(voteAverage: number) {
    const fullStars = Math.floor(voteAverage / 2); // Full stars
    const halfStar = voteAverage % 2 >= 1; // Half star if necessary
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Empty stars

    return { fullStars, halfStar, emptyStars };
  }

  // Navigate to the 'Meus Filmes' page
  goToMeusFilmes() {
    this.router.navigate(['/meusFilmes']);
  }

  // Open the movie trailer in a new tab
  openTrailer(trailerUrl: string): void {
    window.open(trailerUrl, '_blank');
  }
}
