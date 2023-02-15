import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITransporterAccount } from 'app/shared/model/transporter-account.model';

type EntityResponseType = HttpResponse<ITransporterAccount>;
type EntityArrayResponseType = HttpResponse<ITransporterAccount[]>;

@Injectable({ providedIn: 'root' })
export class TransporterAccountService {
  public resourceUrl = SERVER_API_URL + 'api/transporter-accounts';

  constructor(protected http: HttpClient) {}

  create(transporterAccount: ITransporterAccount): Observable<EntityResponseType> {
    return this.http.post<ITransporterAccount>(this.resourceUrl, transporterAccount, { observe: 'response' });
  }

  update(transporterAccount: ITransporterAccount): Observable<EntityResponseType> {
    return this.http.put<ITransporterAccount>(this.resourceUrl, transporterAccount, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITransporterAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITransporterAccount[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
