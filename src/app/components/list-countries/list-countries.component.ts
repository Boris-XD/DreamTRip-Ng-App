import { Component, inject } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { finalize, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICountry } from '../../interfaces/country.interface';

@Component({
  selector: 'app-list-countries',
  imports: [
    AsyncPipe,
    FormsModule
  ],
  templateUrl: './list-countries.component.html',
  styleUrl: './list-countries.component.css'
})
export class ListCountriesComponent {

  private countryService = inject(CountryService);
  public listCountries: ICountry[] = [];
  public listCountriesToVisit: ICountry[] = [];

  ngOnInit(){
    this.filterCountries();
  }


  public subRegions$: Observable<string[]> = this.countryService.getAllSubregions();

  public subRegionSelected = 'Southern Europe';
  public loadCountries = false;

  public filterCountries(){
    this.loadCountries = false;
    this.countryService.getCountriesBySubregion(this.subRegionSelected)
      .pipe
      (
        finalize(() => this.loadCountries = true)
      )
      .subscribe
      ({
        next: (countries: ICountry[]) => {
          this.listCountries = countries.filter(country =>
            !this.listCountriesToVisit.some(visited => visited.name == country.name)
          )
        },

      })
  }
}
