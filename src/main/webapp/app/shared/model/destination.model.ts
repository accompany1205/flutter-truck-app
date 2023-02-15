export interface IDestination {
  id?: number;
  locationId?: number;
  tripId?: number;
}

export class Destination implements IDestination {
  constructor(public id?: number, public locationId?: number, public tripId?: number) {}
}
