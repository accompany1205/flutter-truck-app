import { IReputation } from 'app/shared/model/reputation.model';
import { ITrip } from 'app/shared/model/trip.model';

export interface IClientAccount {
  id?: number;
  phone?: string;
  referal?: string;
  referedBy?: string;
  miniBio?: string;
  verifiedPhone?: boolean;
  photoContentType?: string;
  photo?: any;
  userLogin?: string;
  userId?: number;
  identityIdentity?: string;
  identityId?: number;
  reputations?: IReputation[];
  trips?: ITrip[];
}

export class ClientAccount implements IClientAccount {
  constructor(
    public id?: number,
    public phone?: string,
    public referal?: string,
    public referedBy?: string,
    public miniBio?: string,
    public verifiedPhone?: boolean,
    public photoContentType?: string,
    public photo?: any,
    public userLogin?: string,
    public userId?: number,
    public identityIdentity?: string,
    public identityId?: number,
    public reputations?: IReputation[],
    public trips?: ITrip[]
  ) {
    this.verifiedPhone = this.verifiedPhone || false;
  }
}
