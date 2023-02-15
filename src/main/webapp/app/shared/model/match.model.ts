import { Moment } from 'moment';
import { EMatchState } from 'app/shared/model/enumerations/e-match-state.model';

export interface IMatch {
  id?: number;
  status?: EMatchState;
  date?: Moment;
  conversationId?: number;
  truckId?: number;
  tripId?: number;
}

export class Match implements IMatch {
  constructor(
    public id?: number,
    public status?: EMatchState,
    public date?: Moment,
    public conversationId?: number,
    public truckId?: number,
    public tripId?: number
  ) {}
}
