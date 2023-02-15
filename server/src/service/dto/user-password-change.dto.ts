import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserPasswordChangeDTO {
  @ApiModelProperty({ description: 'User old password', required: true })
  @IsString()
  readonly oldPassword: string;

  @ApiModelProperty({ description: 'User new password', required: true })
  @IsString()
  readonly newPassword: string;
}
