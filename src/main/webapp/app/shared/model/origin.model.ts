export interface IOrigin {
  id?: number;
  locationId?: number;
  tripId?: number;
}

export class Origin implements IOrigin {
  constructor(public id?: number, public locationId?: number, public tripId?: number) {}
}
