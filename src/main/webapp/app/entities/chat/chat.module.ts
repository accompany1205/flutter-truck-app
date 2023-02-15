import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LacusSharedModule } from 'app/shared/shared.module';
import { ChatComponent } from './chat.component';
import { ChatDetailComponent } from './chat-detail.component';
import { ChatUpdateComponent } from './chat-update.component';
import { ChatDeleteDialogComponent } from './chat-delete-dialog.component';
import { chatRoute } from './chat.route';

@NgModule({
  imports: [LacusSharedModule, RouterModule.forChild(chatRoute)],
  declarations: [ChatComponent, ChatDetailComponent, ChatUpdateComponent, ChatDeleteDialogComponent],
  entryComponents: [ChatDeleteDialogComponent]
})
export class LacusChatModule {}
