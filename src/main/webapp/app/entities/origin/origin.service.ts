import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IOrigin } from 'app/shared/model/origin.model';

type EntityResponseType = HttpResponse<IOrigin>;
type EntityArrayResponseType = HttpResponse<IOrigin[]>;

@Injectable({ providedIn: 'root' })
export class OriginService {
  public resourceUrl = SERVER_API_URL + 'api/origins';

  constructor(protected http: HttpClient) {}

  create(origin: IOrigin): Observable<EntityResponseType> {
    return this.http.post<IOrigin>(this.resourceUrl, origin, { observe: 'response' });
  }

  update(origin: IOrigin): Observable<EntityResponseType> {
    return this.http.put<IOrigin>(this.resourceUrl, origin, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrigin>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrigin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
