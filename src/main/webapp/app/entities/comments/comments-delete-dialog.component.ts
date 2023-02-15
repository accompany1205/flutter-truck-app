import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IComments } from 'app/shared/model/comments.model';
import { CommentsService } from './comments.service';

@Component({
  templateUrl: './comments-delete-dialog.component.html'
})
export class CommentsDeleteDialogComponent {
  comments?: IComments;

  constructor(protected commentsService: CommentsService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commentsService.delete(id).subscribe(() => {
      this.eventManager.broadcast('commentsListModification');
      this.activeModal.close();
    });
  }
}
