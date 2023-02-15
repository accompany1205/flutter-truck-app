import { ITruck } from 'app/shared/model/truck.model';
import { IReputation } from 'app/shared/model/reputation.model';
import { IComments } from 'app/shared/model/comments.model';

export interface ITransporterAccount {
  id?: number;
  name?: string;
  phone?: string;
  patentContentType?: string;
  patent?: any;
  balance?: number;
  insuranceContentType?: string;
  insurance?: any;
  referal?: string;
  referedBy?: string;
  miniBio?: string;
  verifiedPhone?: boolean;
  photoContentType?: string;
  photo?: any;
  userLogin?: string;
  userId?: number;
  trucks?: ITruck[];
  reputations?: IReputation[];
  comments?: IComments[];
}

export class TransporterAccount implements ITransporterAccount {
  constructor(
    public id?: number,
    public name?: string,
    public phone?: string,
    public patentContentType?: string,
    public patent?: any,
    public balance?: number,
    public insuranceContentType?: string,
    public insurance?: any,
    public referal?: string,
    public referedBy?: string,
    public miniBio?: string,
    public verifiedPhone?: boolean,
    public photoContentType?: string,
    public photo?: any,
    public userLogin?: string,
    public userId?: number,
    public trucks?: ITruck[],
    public reputations?: IReputation[],
    public comments?: IComments[]
  ) {
    this.verifiedPhone = this.verifiedPhone || false;
  }
}
