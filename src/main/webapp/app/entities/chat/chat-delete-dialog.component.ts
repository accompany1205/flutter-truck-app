import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IChat } from 'app/shared/model/chat.model';
import { ChatService } from './chat.service';

@Component({
  templateUrl: './chat-delete-dialog.component.html'
})
export class ChatDeleteDialogComponent {
  chat?: IChat;

  constructor(protected chatService: ChatService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chatService.delete(id).subscribe(() => {
      this.eventManager.broadcast('chatListModification');
      this.activeModal.close();
    });
  }
}
