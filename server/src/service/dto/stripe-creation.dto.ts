import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class stripeCreationDTO {
  @ApiModelProperty({ description: 'Card id', required: true })
  @IsString()
  readonly id: string;
}