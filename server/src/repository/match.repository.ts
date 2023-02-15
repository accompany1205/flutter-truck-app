import { EntityRepository, Repository } from 'typeorm';
import Match from '../domain/match.entity';

@EntityRepository(Match)
export class MatchRepository extends Repository<Match> {}
