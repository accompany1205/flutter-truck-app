export interface IReputation {
  id?: number;
  rate?: number;
  goods?: number;
  punctuality?: number;
  communication?: number;
  comment?: string;
  transporterAccountId?: number;
  clientAccountId?: number;
}

export class Reputation implements IReputation {
  constructor(
    public id?: number,
    public rate?: number,
    public goods?: number,
    public punctuality?: number,
    public communication?: number,
    public comment?: string,
    public transporterAccountId?: number,
    public clientAccountId?: number
  ) {}
}
