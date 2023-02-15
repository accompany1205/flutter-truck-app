import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserProfileChangeDTO {
  @ApiModelProperty({ description: 'User old password', required: true })
  @IsString()
  readonly firstName: string;

  @ApiModelProperty({ description: 'User new password', required: true })
  @IsString()
  readonly lastName: string;

}
