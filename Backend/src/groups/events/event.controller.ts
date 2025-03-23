import { Controller, Post, Get, Delete, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dtos/createEvent.dto';
import { Types } from 'mongoose';

@Controller('groups/:groupId/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(
    @Param('groupId') groupId: string,
    @Body(new ValidationPipe({ transform: true })) createEventDto: CreateEventDto
  ) {
    console.log('Received event data:', createEventDto);
    return this.eventsService.createEvent(
      new Types.ObjectId(groupId),
      createEventDto
    );
  }

  @Get()
  async getGroupEvents(@Param('groupId') groupId: string) {
    return this.eventsService.findByGroupId(new Types.ObjectId(groupId));
  }

  @Get(':eventId')
  async getEvent(
    @Param('groupId') groupId: string,
    @Param('eventId') eventId: string
  ) {
    return this.eventsService.findById(
      new Types.ObjectId(groupId),
      new Types.ObjectId(eventId)
    );
  }

  @Delete(':eventId')
  async deleteEvent(
    @Param('groupId') groupId: string,
    @Param('eventId') eventId: string
  ) {
    return this.eventsService.deleteEvent(
      new Types.ObjectId(groupId),
      new Types.ObjectId(eventId)
    );
  }
}