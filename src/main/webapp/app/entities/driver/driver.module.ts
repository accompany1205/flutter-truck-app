import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LacusSharedModule } from 'app/shared/shared.module';
import { DriverComponent } from './driver.component';
import { DriverDetailComponent } from './driver-detail.component';
import { DriverUpdateComponent } from './driver-update.component';
import { DriverDeleteDialogComponent } from './driver-delete-dialog.component';
import { driverRoute } from './driver.route';

@NgModule({
  imports: [LacusSharedModule, RouterModule.forChild(driverRoute)],
  declarations: [DriverComponent, DriverDetailComponent, DriverUpdateComponent, DriverDeleteDialogComponent],
  entryComponents: [DriverDeleteDialogComponent]
})
export class LacusDriverModule {}
