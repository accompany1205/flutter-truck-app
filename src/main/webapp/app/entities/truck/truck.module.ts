import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LacusSharedModule } from 'app/shared/shared.module';
import { TruckComponent } from './truck.component';
import { TruckDetailComponent } from './truck-detail.component';
import { TruckUpdateComponent } from './truck-update.component';
import { TruckDeleteDialogComponent } from './truck-delete-dialog.component';
import { truckRoute } from './truck.route';

@NgModule({
  imports: [LacusSharedModule, RouterModule.forChild(truckRoute)],
  declarations: [TruckComponent, TruckDetailComponent, TruckUpdateComponent, TruckDeleteDialogComponent],
  entryComponents: [TruckDeleteDialogComponent]
})
export class LacusTruckModule {}
