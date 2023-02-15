import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IChat, Chat } from 'app/shared/model/chat.model';
import { ChatService } from './chat.service';
import { ChatComponent } from './chat.component';
import { ChatDetailComponent } from './chat-detail.component';
import { ChatUpdateComponent } from './chat-update.component';

@Injectable({ providedIn: 'root' })
export class ChatResolve implements Resolve<IChat> {
  constructor(private service: ChatService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChat> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((chat: HttpResponse<Chat>) => {
          if (chat.body) {
            return of(chat.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Chat());
  }
}

export const chatRoute: Routes = [
  {
    path: '',
    component: ChatComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'Chats'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ChatDetailComponent,
    resolve: {
      chat: ChatResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Chats'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ChatUpdateComponent,
    resolve: {
      chat: ChatResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Chats'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ChatUpdateComponent,
    resolve: {
      chat: ChatResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Chats'
    },
    canActivate: [UserRouteAccessService]
  }
];
