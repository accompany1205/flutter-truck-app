import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LacusSharedModule } from 'app/shared/shared.module';
import { DestinationComponent } from './destination.component';
import { DestinationDetailComponent } from './destination-detail.component';
import { DestinationUpdateComponent } from './destination-update.component';
import { DestinationDeleteDialogComponent } from './destination-delete-dialog.component';
import { destinationRoute } from './destination.route';

@NgModule({
  imports: [LacusSharedModule, RouterModule.forChild(destinationRoute)],
  declarations: [DestinationComponent, DestinationDetailComponent, DestinationUpdateComponent, DestinationDeleteDialogComponent],
  entryComponents: [DestinationDeleteDialogComponent]
})
export class LacusDestinationModule {}
