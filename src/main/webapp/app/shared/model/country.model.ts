export interface ICountry {
  id?: number;
  countryName?: string;
  regionId?: number;
  locationId?: number;
}

export class Country implements ICountry {
  constructor(public id?: number, public countryName?: string, public regionId?: number, public locationId?: number) {}
}
