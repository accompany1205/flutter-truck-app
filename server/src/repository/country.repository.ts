import { EntityRepository, Repository } from 'typeorm';
import Country from '../domain/country.entity';

@EntityRepository(Country)
export class CountryRepository extends Repository<Country> {}
