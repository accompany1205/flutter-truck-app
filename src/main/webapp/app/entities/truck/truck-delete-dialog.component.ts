import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITruck } from 'app/shared/model/truck.model';
import { TruckService } from './truck.service';

@Component({
  templateUrl: './truck-delete-dialog.component.html'
})
export class TruckDeleteDialogComponent {
  truck?: ITruck;

  constructor(protected truckService: TruckService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.truckService.delete(id).subscribe(() => {
      this.eventManager.broadcast('truckListModification');
      this.activeModal.close();
    });
  }
}
