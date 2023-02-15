import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IComments, Comments } from 'app/shared/model/comments.model';
import { CommentsService } from './comments.service';
import { CommentsComponent } from './comments.component';
import { CommentsDetailComponent } from './comments-detail.component';
import { CommentsUpdateComponent } from './comments-update.component';

@Injectable({ providedIn: 'root' })
export class CommentsResolve implements Resolve<IComments> {
  constructor(private service: CommentsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IComments> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((comments: HttpResponse<Comments>) => {
          if (comments.body) {
            return of(comments.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Comments());
  }
}

export const commentsRoute: Routes = [
  {
    path: '',
    component: CommentsComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'Comments'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CommentsDetailComponent,
    resolve: {
      comments: CommentsResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Comments'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CommentsUpdateComponent,
    resolve: {
      comments: CommentsResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Comments'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CommentsUpdateComponent,
    resolve: {
      comments: CommentsResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Comments'
    },
    canActivate: [UserRouteAccessService]
  }
];
