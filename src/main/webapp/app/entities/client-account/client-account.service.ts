import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IClientAccount } from 'app/shared/model/client-account.model';

type EntityResponseType = HttpResponse<IClientAccount>;
type EntityArrayResponseType = HttpResponse<IClientAccount[]>;

@Injectable({ providedIn: 'root' })
export class ClientAccountService {
  public resourceUrl = SERVER_API_URL + 'api/client-accounts';

  constructor(protected http: HttpClient) {}

  create(clientAccount: IClientAccount): Observable<EntityResponseType> {
    return this.http.post<IClientAccount>(this.resourceUrl, clientAccount, { observe: 'response' });
  }

  update(clientAccount: IClientAccount): Observable<EntityResponseType> {
    return this.http.put<IClientAccount>(this.resourceUrl, clientAccount, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClientAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClientAccount[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
