export interface IRegion {
  id?: number;
  regionName?: string;
  countryId?: number;
}

export class Region implements IRegion {
  constructor(public id?: number, public regionName?: string, public countryId?: number) {}
}
