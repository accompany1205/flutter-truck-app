import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LacusSharedModule } from 'app/shared/shared.module';
import { IdentityComponent } from './identity.component';
import { IdentityDetailComponent } from './identity-detail.component';
import { IdentityUpdateComponent } from './identity-update.component';
import { IdentityDeleteDialogComponent } from './identity-delete-dialog.component';
import { identityRoute } from './identity.route';

@NgModule({
  imports: [LacusSharedModule, RouterModule.forChild(identityRoute)],
  declarations: [IdentityComponent, IdentityDetailComponent, IdentityUpdateComponent, IdentityDeleteDialogComponent],
  entryComponents: [IdentityDeleteDialogComponent]
})
export class LacusIdentityModule {}
