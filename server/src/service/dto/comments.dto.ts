import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class commentsDTO {
  @ApiModelProperty({ description: 'Message content', required: true })
  @IsString()
  readonly text: string;

  @ApiModelProperty({ description: 'Trip id', required: true })
  @IsString()
  readonly tripId: string;

  @ApiModelProperty({ description: 'Response for id', required: true })
  @IsString()
  readonly reply?: string;
}
