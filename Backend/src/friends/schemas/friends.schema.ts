import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type FriendsDocument = Friends & Document;

@Schema({timestamps: true})
export class Friends {
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    follower: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    following: Types.ObjectId;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const FriendsSchema = SchemaFactory.createForClass(Friends);
