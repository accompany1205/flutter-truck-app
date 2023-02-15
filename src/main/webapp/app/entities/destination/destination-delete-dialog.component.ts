import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDestination } from 'app/shared/model/destination.model';
import { DestinationService } from './destination.service';

@Component({
  templateUrl: './destination-delete-dialog.component.html'
})
export class DestinationDeleteDialogComponent {
  destination?: IDestination;

  constructor(
    protected destinationService: DestinationService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.destinationService.delete(id).subscribe(() => {
      this.eventManager.broadcast('destinationListModification');
      this.activeModal.close();
    });
  }
}
