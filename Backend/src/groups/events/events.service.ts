import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from './schemas/event.schema';
import { CreateEventDto } from './dtos/createEvent.dto';
import { GroupsService } from '../groups.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private readonly groupsService: GroupsService
  ) {}

  async createEvent(groupId: Types.ObjectId, createEventDto: CreateEventDto): Promise<Event> {
    // Verify group exists
    const group = await this.groupsService.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Verify user is member or admin
    const userId = new Types.ObjectId(createEventDto.createdBy);
    if (!group.members.includes(userId) && !group.admins.includes(userId) && group.creator !== userId) {
      throw new ForbiddenException('User must be a member or admin to create events');
    }

    const event = new this.eventModel({
      ...createEventDto,
      groupId,
      createdAt: new Date()
    });

    return event.save();
  }

  async findByGroupId(groupId: Types.ObjectId): Promise<Event[]> {
    // Verify group exists
    const group = await this.groupsService.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.eventModel
      .find({ groupId })
      .sort({ startDate: 1 })
      .exec();
  }

  async findById(groupId: Types.ObjectId, eventId: Types.ObjectId): Promise<Event> {
    const event = await this.eventModel.findOne({ _id: eventId, groupId }).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async deleteEvent(groupId: Types.ObjectId, eventId: Types.ObjectId): Promise<void> {
    const event = await this.findById(groupId, eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Verify group exists
    const group = await this.groupsService.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Only event creator, group admins, or group creator can delete events
    const createdById = new Types.ObjectId(event.createdBy);
    if (
      !group.admins.includes(createdById) &&
      group.creator !== createdById &&
      event.createdBy !== createdById.toString()
    ) {
      throw new ForbiddenException('Only event creator, group admins, or group creator can delete events');
    }

    await this.eventModel.findByIdAndDelete(eventId).exec();
  }
}