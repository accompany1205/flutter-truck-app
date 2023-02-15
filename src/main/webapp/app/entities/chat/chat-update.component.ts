import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IChat, Chat } from 'app/shared/model/chat.model';
import { ChatService } from './chat.service';
import { IConversation } from 'app/shared/model/conversation.model';
import { ConversationService } from 'app/entities/conversation/conversation.service';

@Component({
  selector: 'jhi-chat-update',
  templateUrl: './chat-update.component.html'
})
export class ChatUpdateComponent implements OnInit {
  isSaving = false;
  conversations: IConversation[] = [];

  editForm = this.fb.group({
    id: [],
    text: [],
    date: [],
    author: [],
    conversationId: []
  });

  constructor(
    protected chatService: ChatService,
    protected conversationService: ConversationService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chat }) => {
      if (!chat.id) {
        const today = moment().startOf('day');
        chat.date = today;
      }

      this.updateForm(chat);

      this.conversationService.query().subscribe((res: HttpResponse<IConversation[]>) => (this.conversations = res.body || []));
    });
  }

  updateForm(chat: IChat): void {
    this.editForm.patchValue({
      id: chat.id,
      text: chat.text,
      date: chat.date ? chat.date.format(DATE_TIME_FORMAT) : null,
      author: chat.author,
      conversationId: chat.conversationId
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chat = this.createFromForm();
    if (chat.id !== undefined) {
      this.subscribeToSaveResponse(this.chatService.update(chat));
    } else {
      this.subscribeToSaveResponse(this.chatService.create(chat));
    }
  }

  private createFromForm(): IChat {
    return {
      ...new Chat(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      date: this.editForm.get(['date'])!.value ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      author: this.editForm.get(['author'])!.value,
      conversationId: this.editForm.get(['conversationId'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChat>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IConversation): any {
    return item.id;
  }
}
