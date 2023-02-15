import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'transporter-account',
        loadChildren: () => import('./transporter-account/transporter-account.module').then(m => m.LacusTransporterAccountModule)
      },
      {
        path: 'reputation',
        loadChildren: () => import('./reputation/reputation.module').then(m => m.LacusReputationModule)
      },
      {
        path: 'client-account',
        loadChildren: () => import('./client-account/client-account.module').then(m => m.LacusClientAccountModule)
      },
      {
        path: 'identity',
        loadChildren: () => import('./identity/identity.module').then(m => m.LacusIdentityModule)
      },
      {
        path: 'comments',
        loadChildren: () => import('./comments/comments.module').then(m => m.LacusCommentsModule)
      },
      {
        path: 'origin',
        loadChildren: () => import('./origin/origin.module').then(m => m.LacusOriginModule)
      },
      {
        path: 'destination',
        loadChildren: () => import('./destination/destination.module').then(m => m.LacusDestinationModule)
      },
      {
        path: 'trip',
        loadChildren: () => import('./trip/trip.module').then(m => m.LacusTripModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('./chat/chat.module').then(m => m.LacusChatModule)
      },
      {
        path: 'match',
        loadChildren: () => import('./match/match.module').then(m => m.LacusMatchModule)
      },
      {
        path: 'truck',
        loadChildren: () => import('./truck/truck.module').then(m => m.LacusTruckModule)
      },
      {
        path: 'driver',
        loadChildren: () => import('./driver/driver.module').then(m => m.LacusDriverModule)
      },
      {
        path: 'region',
        loadChildren: () => import('./region/region.module').then(m => m.LacusRegionModule)
      },
      {
        path: 'country',
        loadChildren: () => import('./country/country.module').then(m => m.LacusCountryModule)
      },
      {
        path: 'location',
        loadChildren: () => import('./location/location.module').then(m => m.LacusLocationModule)
      },
      {
        path: 'conversation',
        loadChildren: () => import('./conversation/conversation.module').then(m => m.LacusConversationModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class LacusEntityModule {}
