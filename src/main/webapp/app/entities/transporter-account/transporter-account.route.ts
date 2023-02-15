import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ITransporterAccount, TransporterAccount } from 'app/shared/model/transporter-account.model';
import { TransporterAccountService } from './transporter-account.service';
import { TransporterAccountComponent } from './transporter-account.component';
import { TransporterAccountDetailComponent } from './transporter-account-detail.component';
import { TransporterAccountUpdateComponent } from './transporter-account-update.component';

@Injectable({ providedIn: 'root' })
export class TransporterAccountResolve implements Resolve<ITransporterAccount> {
  constructor(private service: TransporterAccountService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITransporterAccount> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((transporterAccount: HttpResponse<TransporterAccount>) => {
          if (transporterAccount.body) {
            return of(transporterAccount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TransporterAccount());
  }
}

export const transporterAccountRoute: Routes = [
  {
    path: '',
    component: TransporterAccountComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'TransporterAccounts'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: TransporterAccountDetailComponent,
    resolve: {
      transporterAccount: TransporterAccountResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'TransporterAccounts'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TransporterAccountUpdateComponent,
    resolve: {
      transporterAccount: TransporterAccountResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'TransporterAccounts'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: TransporterAccountUpdateComponent,
    resolve: {
      transporterAccount: TransporterAccountResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'TransporterAccounts'
    },
    canActivate: [UserRouteAccessService]
  }
];
