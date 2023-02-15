export interface IDriver {
  id?: number;
  firstName?: string;
  lastName?: string;
  currentCoordinate?: string;
  truckId?: number;
}

export class Driver implements IDriver {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public currentCoordinate?: string,
    public truckId?: number
  ) {}
}
