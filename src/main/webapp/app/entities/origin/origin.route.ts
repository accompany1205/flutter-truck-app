import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IOrigin, Origin } from 'app/shared/model/origin.model';
import { OriginService } from './origin.service';
import { OriginComponent } from './origin.component';
import { OriginDetailComponent } from './origin-detail.component';
import { OriginUpdateComponent } from './origin-update.component';

@Injectable({ providedIn: 'root' })
export class OriginResolve implements Resolve<IOrigin> {
  constructor(private service: OriginService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrigin> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((origin: HttpResponse<Origin>) => {
          if (origin.body) {
            return of(origin.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Origin());
  }
}

export const originRoute: Routes = [
  {
    path: '',
    component: OriginComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'Origins'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: OriginDetailComponent,
    resolve: {
      origin: OriginResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Origins'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: OriginUpdateComponent,
    resolve: {
      origin: OriginResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Origins'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: OriginUpdateComponent,
    resolve: {
      origin: OriginResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Origins'
    },
    canActivate: [UserRouteAccessService]
  }
];
