import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IMatch, Match } from 'app/shared/model/match.model';
import { MatchService } from './match.service';
import { MatchComponent } from './match.component';
import { MatchDetailComponent } from './match-detail.component';
import { MatchUpdateComponent } from './match-update.component';

@Injectable({ providedIn: 'root' })
export class MatchResolve implements Resolve<IMatch> {
  constructor(private service: MatchService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMatch> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((match: HttpResponse<Match>) => {
          if (match.body) {
            return of(match.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Match());
  }
}

export const matchRoute: Routes = [
  {
    path: '',
    component: MatchComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'Matches'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: MatchDetailComponent,
    resolve: {
      match: MatchResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Matches'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: MatchUpdateComponent,
    resolve: {
      match: MatchResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Matches'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: MatchUpdateComponent,
    resolve: {
      match: MatchResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Matches'
    },
    canActivate: [UserRouteAccessService]
  }
];
