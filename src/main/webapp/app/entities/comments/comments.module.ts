import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LacusSharedModule } from 'app/shared/shared.module';
import { CommentsComponent } from './comments.component';
import { CommentsDetailComponent } from './comments-detail.component';
import { CommentsUpdateComponent } from './comments-update.component';
import { CommentsDeleteDialogComponent } from './comments-delete-dialog.component';
import { commentsRoute } from './comments.route';

@NgModule({
  imports: [LacusSharedModule, RouterModule.forChild(commentsRoute)],
  declarations: [CommentsComponent, CommentsDetailComponent, CommentsUpdateComponent, CommentsDeleteDialogComponent],
  entryComponents: [CommentsDeleteDialogComponent]
})
export class LacusCommentsModule {}
