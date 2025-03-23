import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type GroupDocument = Group & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Group {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  handle: string;

  @Prop()
  description: string;

  @Prop()
  backgroundImage: string;

  @Prop()
  icon: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop()
  phone: string;

  @Prop()
  location: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creator: Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  admins: Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  members: Types.ObjectId[];

  @Prop({ default: 0 })
  postsCount: number;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'public'
  })
  privacy: string;

  @Prop({
    type: [{
      user: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['admin', 'moderator', 'member', 'pending'] },
      joinedAt: { type: Date, default: Date.now },
      message: String
    }]
  })
  memberDetails: {
    user: Types.ObjectId;
    role: string;
    joinedAt: Date;
    message?: string;
  }[];

  @Prop({
    type: [{
      type: { type: String, enum: ['post', 'event', 'file'] },
      title: String,
      description: String,
      createdAt: { type: Date, default: Date.now },
      creator: { type: MongooseSchema.Types.ObjectId, ref: 'User' }
    }]
  })
  activities: {
    type: string;
    title: string;
    description: string;
    createdAt: Date;
    creator: Types.ObjectId;
  }[];

  @Prop({ type: Object })
  settings: {
    allowMemberPosts: boolean;
    allowMemberEvents: boolean;
    allowMemberFiles: boolean;
    requireAdminApproval: boolean;
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

// Add indexes
GroupSchema.index({ name: 'text', description: 'text' });
GroupSchema.index({ creator: 1 });

// Add virtual for member count
GroupSchema.virtual('memberCount').get(function(this: GroupDocument) {
  return this.members?.length || 0;
});

// Add virtual for admin count
GroupSchema.virtual('adminCount').get(function(this: GroupDocument) {
  return this.admins?.length || 0;
});