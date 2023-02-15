import { EntityRepository, Repository } from 'typeorm';
import Reputation from '../domain/reputation.entity';

@EntityRepository(Reputation)
export class ReputationRepository extends Repository<Reputation> {

    findReputationOfMatchForUser(userId: string, matchId: string) {
        return this.find({where: {to: {id: userId} , match: {id: matchId} }});
    }
}
