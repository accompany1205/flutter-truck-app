export interface ILocation {
  id?: number;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  stateProvince?: string;
  originId?: number;
  destinationId?: number;
  countryId?: number;
}

export class Location implements ILocation {
  constructor(
    public id?: number,
    public streetAddress?: string,
    public postalCode?: string,
    public city?: string,
    public stateProvince?: string,
    public originId?: number,
    public destinationId?: number,
    public countryId?: number
  ) {}
}
