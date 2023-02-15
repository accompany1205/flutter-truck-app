import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from '../web/rest/comments.controller';
import { CommentsRepository } from '../repository/comments.repository';
import { CommentsService } from '../service/comments.service';
import { TripModule } from './trip.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsRepository]), TripModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService]
})
export class CommentsModule {}
