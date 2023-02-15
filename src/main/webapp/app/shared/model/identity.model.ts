import { EIdentity } from 'app/shared/model/enumerations/e-identity.model';

export interface IIdentity {
  id?: number;
  identityContentType?: string;
  identity?: any;
  type?: EIdentity;
}

export class Identity implements IIdentity {
  constructor(public id?: number, public identityContentType?: string, public identity?: any, public type?: EIdentity) {}
}
