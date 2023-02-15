import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITrip } from 'app/shared/model/trip.model';

@Component({
  selector: 'jhi-trip-detail',
  templateUrl: './trip-detail.component.html'
})
export class TripDetailComponent implements OnInit {
  trip: ITrip | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trip }) => (this.trip = trip));
  }

  previousState(): void {
    window.history.back();
  }
}
