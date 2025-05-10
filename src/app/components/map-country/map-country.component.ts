import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map-country',
  imports: [
    GoogleMap,
    MapAdvancedMarker,
    JsonPipe
  ],
  templateUrl: './map-country.component.html',
  styleUrl: './map-country.component.css'
})
export class MapCountryComponent {

  @Input()
  markers: google.maps.LatLngLiteral[] = [];

  public center: google.maps.LatLngLiteral = {lat: 40, lng: -20};


}
