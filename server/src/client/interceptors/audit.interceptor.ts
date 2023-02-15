import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../../domain/user.entity';
import { BaseEntity } from '../../domain/base/base.entity';


@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const body: BaseEntity = context.switchToHttp().getRequest().body;
    const user: User = context.switchToHttp().getRequest().user;

    if (!user) {
      return next.handle()
        .pipe(() => {
          throw new HttpException('You need to authenticate !', HttpStatus.FORBIDDEN);
        });
    }
  
    body.createdBy = user.id;
    body.createdDate = new Date();

    return next.handle();
  }
}
