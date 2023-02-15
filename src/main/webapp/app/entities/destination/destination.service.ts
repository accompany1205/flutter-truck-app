import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDestination } from 'app/shared/model/destination.model';

type EntityResponseType = HttpResponse<IDestination>;
type EntityArrayResponseType = HttpResponse<IDestination[]>;

@Injectable({ providedIn: 'root' })
export class DestinationService {
  public resourceUrl = SERVER_API_URL + 'api/destinations';

  constructor(protected http: HttpClient) {}

  create(destination: IDestination): Observable<EntityResponseType> {
    return this.http.post<IDestination>(this.resourceUrl, destination, { observe: 'response' });
  }

  update(destination: IDestination): Observable<EntityResponseType> {
    return this.http.put<IDestination>(this.resourceUrl, destination, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDestination>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDestination[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
