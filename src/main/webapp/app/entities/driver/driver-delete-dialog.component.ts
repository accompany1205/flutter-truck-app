import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDriver } from 'app/shared/model/driver.model';
import { DriverService } from './driver.service';

@Component({
  templateUrl: './driver-delete-dialog.component.html'
})
export class DriverDeleteDialogComponent {
  driver?: IDriver;

  constructor(protected driverService: DriverService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.driverService.delete(id).subscribe(() => {
      this.eventManager.broadcast('driverListModification');
      this.activeModal.close();
    });
  }
}
