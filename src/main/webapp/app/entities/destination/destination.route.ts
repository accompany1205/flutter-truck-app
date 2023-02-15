import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IDestination, Destination } from 'app/shared/model/destination.model';
import { DestinationService } from './destination.service';
import { DestinationComponent } from './destination.component';
import { DestinationDetailComponent } from './destination-detail.component';
import { DestinationUpdateComponent } from './destination-update.component';

@Injectable({ providedIn: 'root' })
export class DestinationResolve implements Resolve<IDestination> {
  constructor(private service: DestinationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDestination> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((destination: HttpResponse<Destination>) => {
          if (destination.body) {
            return of(destination.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Destination());
  }
}

export const destinationRoute: Routes = [
  {
    path: '',
    component: DestinationComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'Destinations'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DestinationDetailComponent,
    resolve: {
      destination: DestinationResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Destinations'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DestinationUpdateComponent,
    resolve: {
      destination: DestinationResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Destinations'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DestinationUpdateComponent,
    resolve: {
      destination: DestinationResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Destinations'
    },
    canActivate: [UserRouteAccessService]
  }
];
