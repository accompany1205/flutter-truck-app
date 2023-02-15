import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReputation } from 'app/shared/model/reputation.model';

@Component({
  selector: 'jhi-reputation-detail',
  templateUrl: './reputation-detail.component.html'
})
export class ReputationDetailComponent implements OnInit {
  reputation: IReputation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reputation }) => (this.reputation = reputation));
  }

  previousState(): void {
    window.history.back();
  }
}
