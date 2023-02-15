import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IClientAccount, ClientAccount } from 'app/shared/model/client-account.model';
import { ClientAccountService } from './client-account.service';
import { ClientAccountComponent } from './client-account.component';
import { ClientAccountDetailComponent } from './client-account-detail.component';
import { ClientAccountUpdateComponent } from './client-account-update.component';

@Injectable({ providedIn: 'root' })
export class ClientAccountResolve implements Resolve<IClientAccount> {
  constructor(private service: ClientAccountService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClientAccount> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((clientAccount: HttpResponse<ClientAccount>) => {
          if (clientAccount.body) {
            return of(clientAccount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ClientAccount());
  }
}

export const clientAccountRoute: Routes = [
  {
    path: '',
    component: ClientAccountComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'ClientAccounts'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ClientAccountDetailComponent,
    resolve: {
      clientAccount: ClientAccountResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ClientAccounts'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ClientAccountUpdateComponent,
    resolve: {
      clientAccount: ClientAccountResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ClientAccounts'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ClientAccountUpdateComponent,
    resolve: {
      clientAccount: ClientAccountResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ClientAccounts'
    },
    canActivate: [UserRouteAccessService]
  }
];
