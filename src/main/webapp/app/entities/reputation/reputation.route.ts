import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IReputation, Reputation } from 'app/shared/model/reputation.model';
import { ReputationService } from './reputation.service';
import { ReputationComponent } from './reputation.component';
import { ReputationDetailComponent } from './reputation-detail.component';
import { ReputationUpdateComponent } from './reputation-update.component';

@Injectable({ providedIn: 'root' })
export class ReputationResolve implements Resolve<IReputation> {
  constructor(private service: ReputationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReputation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((reputation: HttpResponse<Reputation>) => {
          if (reputation.body) {
            return of(reputation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Reputation());
  }
}

export const reputationRoute: Routes = [
  {
    path: '',
    component: ReputationComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'Reputations'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ReputationDetailComponent,
    resolve: {
      reputation: ReputationResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Reputations'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ReputationUpdateComponent,
    resolve: {
      reputation: ReputationResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Reputations'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ReputationUpdateComponent,
    resolve: {
      reputation: ReputationResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Reputations'
    },
    canActivate: [UserRouteAccessService]
  }
];
