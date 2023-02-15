import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrigin } from 'app/shared/model/origin.model';

@Component({
  selector: 'jhi-origin-detail',
  templateUrl: './origin-detail.component.html'
})
export class OriginDetailComponent implements OnInit {
  origin: IOrigin | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ origin }) => (this.origin = origin));
  }

  previousState(): void {
    window.history.back();
  }
}
