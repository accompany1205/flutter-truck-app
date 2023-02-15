import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IReputation } from 'app/shared/model/reputation.model';
import { ReputationService } from './reputation.service';

@Component({
  templateUrl: './reputation-delete-dialog.component.html'
})
export class ReputationDeleteDialogComponent {
  reputation?: IReputation;

  constructor(
    protected reputationService: ReputationService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reputationService.delete(id).subscribe(() => {
      this.eventManager.broadcast('reputationListModification');
      this.activeModal.close();
    });
  }
}
