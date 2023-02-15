import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LacusSharedModule } from 'app/shared/shared.module';
import { ConversationComponent } from './conversation.component';
import { ConversationDetailComponent } from './conversation-detail.component';
import { ConversationUpdateComponent } from './conversation-update.component';
import { ConversationDeleteDialogComponent } from './conversation-delete-dialog.component';
import { conversationRoute } from './conversation.route';

@NgModule({
  imports: [LacusSharedModule, RouterModule.forChild(conversationRoute)],
  declarations: [ConversationComponent, ConversationDetailComponent, ConversationUpdateComponent, ConversationDeleteDialogComponent],
  entryComponents: [ConversationDeleteDialogComponent]
})
export class LacusConversationModule {}
