import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class stripeConfirmationDTO {
  @ApiModelProperty({ description: 'Stripe confirmation id', required: true })
  @IsString()
  readonly id: string;
}