import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMatch } from 'app/shared/model/match.model';
import { MatchService } from './match.service';

@Component({
  templateUrl: './match-delete-dialog.component.html'
})
export class MatchDeleteDialogComponent {
  match?: IMatch;

  constructor(protected matchService: MatchService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.matchService.delete(id).subscribe(() => {
      this.eventManager.broadcast('matchListModification');
      this.activeModal.close();
    });
  }
}
