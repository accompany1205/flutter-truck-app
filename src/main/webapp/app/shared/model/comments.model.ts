import { Moment } from 'moment';

export interface IComments {
  id?: number;
  text?: string;
  date?: Moment;
  tripId?: number;
  transporterAccountId?: number;
}

export class Comments implements IComments {
  constructor(
    public id?: number,
    public text?: string,
    public date?: Moment,
    public tripId?: number,
    public transporterAccountId?: number
  ) {}
}
