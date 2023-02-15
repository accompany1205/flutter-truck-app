import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITruck } from 'app/shared/model/truck.model';

type EntityResponseType = HttpResponse<ITruck>;
type EntityArrayResponseType = HttpResponse<ITruck[]>;

@Injectable({ providedIn: 'root' })
export class TruckService {
  public resourceUrl = SERVER_API_URL + 'api/trucks';

  constructor(protected http: HttpClient) {}

  create(truck: ITruck): Observable<EntityResponseType> {
    return this.http.post<ITruck>(this.resourceUrl, truck, { observe: 'response' });
  }

  update(truck: ITruck): Observable<EntityResponseType> {
    return this.http.put<ITruck>(this.resourceUrl, truck, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITruck>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITruck[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
