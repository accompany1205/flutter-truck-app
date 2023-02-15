import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LacusSharedModule } from 'app/shared/shared.module';
import { OriginComponent } from './origin.component';
import { OriginDetailComponent } from './origin-detail.component';
import { OriginUpdateComponent } from './origin-update.component';
import { OriginDeleteDialogComponent } from './origin-delete-dialog.component';
import { originRoute } from './origin.route';

@NgModule({
  imports: [LacusSharedModule, RouterModule.forChild(originRoute)],
  declarations: [OriginComponent, OriginDetailComponent, OriginUpdateComponent, OriginDeleteDialogComponent],
  entryComponents: [OriginDeleteDialogComponent]
})
export class LacusOriginModule {}
