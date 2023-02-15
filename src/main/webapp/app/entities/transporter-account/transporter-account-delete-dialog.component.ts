import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITransporterAccount } from 'app/shared/model/transporter-account.model';
import { TransporterAccountService } from './transporter-account.service';

@Component({
  templateUrl: './transporter-account-delete-dialog.component.html'
})
export class TransporterAccountDeleteDialogComponent {
  transporterAccount?: ITransporterAccount;

  constructor(
    protected transporterAccountService: TransporterAccountService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.transporterAccountService.delete(id).subscribe(() => {
      this.eventManager.broadcast('transporterAccountListModification');
      this.activeModal.close();
    });
  }
}
