import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { LacusSharedModule } from 'app/shared/shared.module';
import { LacusCoreModule } from 'app/core/core.module';
import { LacusAppRoutingModule } from './app-routing.module';
import { LacusHomeModule } from './home/home.module';
import { LacusEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    LacusSharedModule,
    LacusCoreModule,
    LacusHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    LacusEntityModule,
    LacusAppRoutingModule
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
  bootstrap: [MainComponent]
})
export class LacusAppModule {}
