import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IClientAccount } from 'app/shared/model/client-account.model';
import { ClientAccountService } from './client-account.service';

@Component({
  templateUrl: './client-account-delete-dialog.component.html'
})
export class ClientAccountDeleteDialogComponent {
  clientAccount?: IClientAccount;

  constructor(
    protected clientAccountService: ClientAccountService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clientAccountService.delete(id).subscribe(() => {
      this.eventManager.broadcast('clientAccountListModification');
      this.activeModal.close();
    });
  }
}
