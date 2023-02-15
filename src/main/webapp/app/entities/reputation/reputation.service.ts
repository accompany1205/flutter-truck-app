import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IReputation } from 'app/shared/model/reputation.model';

type EntityResponseType = HttpResponse<IReputation>;
type EntityArrayResponseType = HttpResponse<IReputation[]>;

@Injectable({ providedIn: 'root' })
export class ReputationService {
  public resourceUrl = SERVER_API_URL + 'api/reputations';

  constructor(protected http: HttpClient) {}

  create(reputation: IReputation): Observable<EntityResponseType> {
    return this.http.post<IReputation>(this.resourceUrl, reputation, { observe: 'response' });
  }

  update(reputation: IReputation): Observable<EntityResponseType> {
    return this.http.put<IReputation>(this.resourceUrl, reputation, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReputation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReputation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
