import { EntityRepository, Repository } from 'typeorm';
import Comments from '../domain/comments.entity';

@EntityRepository(Comments)
export class CommentsRepository extends Repository<Comments> {

  public findSortedCommentsForTrip(tripId: string, skip: number, limit: number): Promise<[Comments[], number]>{
    return this.createQueryBuilder('Comments')
      .leftJoinAndSelect("Comments.comments", "replies")
      .leftJoinAndSelect("replies.user", "replyingUser")
      .leftJoinAndSelect("Comments.user", "user")
      .where("Comments.tripId = :id AND Comments.reply IS NULL", { id: tripId })
      .orderBy({
          'Comments.createdDate': 'ASC',
          'replies.createdDate': 'ASC'
      })
      .limit(limit)
      .take(skip)
      .getManyAndCount()
  }

}
