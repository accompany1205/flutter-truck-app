import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IConversation } from 'app/shared/model/conversation.model';
import { ConversationService } from './conversation.service';

@Component({
  templateUrl: './conversation-delete-dialog.component.html'
})
export class ConversationDeleteDialogComponent {
  conversation?: IConversation;

  constructor(
    protected conversationService: ConversationService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.conversationService.delete(id).subscribe(() => {
      this.eventManager.broadcast('conversationListModification');
      this.activeModal.close();
    });
  }
}
