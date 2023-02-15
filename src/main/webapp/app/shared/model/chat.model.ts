import { Moment } from 'moment';

export interface IChat {
  id?: number;
  text?: string;
  date?: Moment;
  author?: string;
  conversationId?: number;
}

export class Chat implements IChat {
  constructor(public id?: number, public text?: string, public date?: Moment, public author?: string, public conversationId?: number) {}
}
