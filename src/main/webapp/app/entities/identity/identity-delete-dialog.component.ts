import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IIdentity } from 'app/shared/model/identity.model';
import { IdentityService } from './identity.service';

@Component({
  templateUrl: './identity-delete-dialog.component.html'
})
export class IdentityDeleteDialogComponent {
  identity?: IIdentity;

  constructor(protected identityService: IdentityService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.identityService.delete(id).subscribe(() => {
      this.eventManager.broadcast('identityListModification');
      this.activeModal.close();
    });
  }
}
