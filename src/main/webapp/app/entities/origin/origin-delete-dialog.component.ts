import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrigin } from 'app/shared/model/origin.model';
import { OriginService } from './origin.service';

@Component({
  templateUrl: './origin-delete-dialog.component.html'
})
export class OriginDeleteDialogComponent {
  origin?: IOrigin;

  constructor(protected originService: OriginService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.originService.delete(id).subscribe(() => {
      this.eventManager.broadcast('originListModification');
      this.activeModal.close();
    });
  }
}
