import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Trip from 'src/domain/trip.entity';
import { User } from 'src/domain/user.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Comments from '../domain/comments.entity';
import { CommentsRepository } from '../repository/comments.repository';
import { commentsDTO } from './dto/comment.dto';
import { TripService } from './trip.service';

@Injectable()
export class CommentsService {
  logger = new Logger('CommentsService');

  constructor(
    @InjectRepository(CommentsRepository) private commentsRepository: CommentsRepository,
    private tripService: TripService
  ) { }

  async findById(id: string, options?: FindOneOptions<Comments>): Promise<Comments | undefined> {
    return await this.commentsRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Comments>): Promise<Comments | undefined> {
    return await this.commentsRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Comments>): Promise<[Comments[], number]> {
    return await this.commentsRepository.findAndCount(options);
  }

  async findSortedCommentsForTrip(tripId: string, skip: number, limit: number): Promise<[Comments[], number]>{
    return await this.commentsRepository.findSortedCommentsForTrip(tripId, skip, limit);
  }

  async save(comments: commentsDTO, user: User): Promise<Comments | undefined> {

    const trip: Trip = await this.tripService.findById(comments.tripId);

    const comment = new Comments();

    comment.text = comments.text;
    comment.user = user;
    comment.createdDate = new Date();
    comment.createdBy = user.id;
    comment.trip = trip;
    if (comments.reply) {
      const reply: Comments = await this.findById(comments.reply, { relations: ['trip'] });
      if (reply.trip.id !== trip.id) {
        // Trying to Reply to a comment that does not belong to the trip.
        this.logger.warn('user {} is trying to reply on a comment that does not belong to the trip', user.login);
        throw new HttpException('You are not allowed !', HttpStatus.FORBIDDEN);
      }
      comment.reply = { id: comments.reply } as Comments;
    } else {
      comment.comments = [];
    }

    if (trip) {
      if (trip.clientAccount.id === user.id || user.transporterAccount) {
        return await this.commentsRepository.save(comment);
      } else {
        // user is a client that tries to chat !! this is not normal
        this.logger.warn('user {} which is a client, is trying to post a comment', user.login);
        throw new HttpException('You are not allowed !', HttpStatus.FORBIDDEN);
      }
    }
  }

  async update(comments: Comments): Promise<Comments | undefined> {
    //return await this.save(comments, null);
    return undefined;
  }

  async delete(user: User, comments: Comments): Promise<Comments | undefined> {
    if (!this.userHasRightToAccess(user.id, comments.id)) {
      this.logger.warn('user {} is trying to delete a comment that is not his', user.login);
      throw new HttpException('You are not allowed !', HttpStatus.FORBIDDEN);
    }
    return await this.commentsRepository.softRemove(comments);
  }

  public async userHasRightToAccess(userId: string, commentId: string): Promise<boolean> {
    const comment: Comments = await this.findById(commentId);
    if (!comment) {
      return false;
    }
    return comment.createdBy === userId;
  }
}
