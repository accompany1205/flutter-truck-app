import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChat } from 'app/shared/model/chat.model';

@Component({
  selector: 'jhi-chat-detail',
  templateUrl: './chat-detail.component.html'
})
export class ChatDetailComponent implements OnInit {
  chat: IChat | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chat }) => (this.chat = chat));
  }

  previousState(): void {
    window.history.back();
  }
}
