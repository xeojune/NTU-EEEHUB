import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteEventDto {
  @IsString()
  @IsNotEmpty()
  groupId: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  userId: string; // The user attempting to delete the event
}