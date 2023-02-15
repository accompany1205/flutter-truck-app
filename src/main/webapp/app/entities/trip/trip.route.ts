import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ITrip, Trip } from 'app/shared/model/trip.model';
import { TripService } from './trip.service';
import { TripComponent } from './trip.component';
import { TripDetailComponent } from './trip-detail.component';
import { TripUpdateComponent } from './trip-update.component';

@Injectable({ providedIn: 'root' })
export class TripResolve implements Resolve<ITrip> {
  constructor(private service: TripService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITrip> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((trip: HttpResponse<Trip>) => {
          if (trip.body) {
            return of(trip.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Trip());
  }
}

export const tripRoute: Routes = [
  {
    path: '',
    component: TripComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'Trips'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: TripDetailComponent,
    resolve: {
      trip: TripResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Trips'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TripUpdateComponent,
    resolve: {
      trip: TripResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Trips'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: TripUpdateComponent,
    resolve: {
      trip: TripResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Trips'
    },
    canActivate: [UserRouteAccessService]
  }
];
