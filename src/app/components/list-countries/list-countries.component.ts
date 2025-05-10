import { Component, inject } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { finalize, Observable } from 'rxjs';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICountry } from '../../interfaces/country.interface';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MapCountryComponent } from '../map-country/map-country.component';

@Component({
  selector: 'app-list-countries',
  imports: [
    AsyncPipe,
    FormsModule,
    CdkDropList,
    CdkDrag,
    NgTemplateOutlet,
    MapCountryComponent
  ],
  templateUrl: './list-countries.component.html',
  styleUrl: './list-countries.component.css'
})
export class ListCountriesComponent {

  private countryService = inject(CountryService);
  public listCountries: ICountry[] = [];
  public listCountriesToVisit: ICountry[] = [];
  public markers: google.maps.LatLngLiteral[] = [];

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

  drop(event: CdkDragDrop<ICountry[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      if (event.previousContainer.id == "listCountries" &&
          event.container.id == "listCountriesToVisit"){
        this.markers.push({
          lat: Number(this.listCountriesToVisit[event.currentIndex].latlong[0]),
          lng: Number(this.listCountriesToVisit[event.currentIndex].latlong[1]),
        })
      } else if (event.previousContainer.id == "listCountriesToVisit" &&
        event.container.id == "listCountries"){
        const indexMarker = this.markers.findIndex( marker =>
                              marker.lat == Number(this.listCountries[event.currentIndex].latlong[0]) &&
                              marker.lng == Number(this.listCountries[event.currentIndex].latlong[1]))
        this.markers.splice(indexMarker, 1);
      }

      console.log(this.markers)
    }
  }
}
