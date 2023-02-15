import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IIdentity, Identity } from 'app/shared/model/identity.model';
import { IdentityService } from './identity.service';
import { IdentityComponent } from './identity.component';
import { IdentityDetailComponent } from './identity-detail.component';
import { IdentityUpdateComponent } from './identity-update.component';

@Injectable({ providedIn: 'root' })
export class IdentityResolve implements Resolve<IIdentity> {
  constructor(private service: IdentityService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIdentity> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((identity: HttpResponse<Identity>) => {
          if (identity.body) {
            return of(identity.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Identity());
  }
}

export const identityRoute: Routes = [
  {
    path: '',
    component: IdentityComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'Identities'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: IdentityDetailComponent,
    resolve: {
      identity: IdentityResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Identities'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: IdentityUpdateComponent,
    resolve: {
      identity: IdentityResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Identities'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: IdentityUpdateComponent,
    resolve: {
      identity: IdentityResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Identities'
    },
    canActivate: [UserRouteAccessService]
  }
];
