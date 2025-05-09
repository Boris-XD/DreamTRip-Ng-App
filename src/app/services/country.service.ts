import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { first, map } from 'rxjs';
import { ICountry } from '../interfaces/country.interface';

@Injectable({providedIn: 'root'})
export class CountryService {
  constructor() { }

  private URL_BASE = "https://restcountries.com/v3.1";
  private http = inject(HttpClient);

  public getAllSubregions(){
    return this.http.get<string[]>('/data/subregions.json')
      .pipe(first())
  }

  public getCountriesBySubregion(subregion: string){
    return this.http.get<any[]>(`${this.URL_BASE}/subregion/${subregion}`)
      .pipe(
        first(),
        map((countries: any[]) => countries.map( country => {
          return {
            name: country.name.common,
            flag: country.flags.png,
            latlong: country.latlng
          } as ICountry
        }))
      )
  }
}
