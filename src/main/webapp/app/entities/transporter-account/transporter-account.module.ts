import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LacusSharedModule } from 'app/shared/shared.module';
import { TransporterAccountComponent } from './transporter-account.component';
import { TransporterAccountDetailComponent } from './transporter-account-detail.component';
import { TransporterAccountUpdateComponent } from './transporter-account-update.component';
import { TransporterAccountDeleteDialogComponent } from './transporter-account-delete-dialog.component';
import { transporterAccountRoute } from './transporter-account.route';

@NgModule({
  imports: [LacusSharedModule, RouterModule.forChild(transporterAccountRoute)],
  declarations: [
    TransporterAccountComponent,
    TransporterAccountDetailComponent,
    TransporterAccountUpdateComponent,
    TransporterAccountDeleteDialogComponent
  ],
  entryComponents: [TransporterAccountDeleteDialogComponent]
})
export class LacusTransporterAccountModule {}
