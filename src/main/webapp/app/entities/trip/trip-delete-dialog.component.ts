import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITrip } from 'app/shared/model/trip.model';
import { TripService } from './trip.service';

@Component({
  templateUrl: './trip-delete-dialog.component.html'
})
export class TripDeleteDialogComponent {
  trip?: ITrip;

  constructor(protected tripService: TripService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tripService.delete(id).subscribe(() => {
      this.eventManager.broadcast('tripListModification');
      this.activeModal.close();
    });
  }
}
