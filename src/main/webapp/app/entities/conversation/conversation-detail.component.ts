import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConversation } from 'app/shared/model/conversation.model';

@Component({
  selector: 'jhi-conversation-detail',
  templateUrl: './conversation-detail.component.html'
})
export class ConversationDetailComponent implements OnInit {
  conversation: IConversation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ conversation }) => (this.conversation = conversation));
  }

  previousState(): void {
    window.history.back();
  }
}
