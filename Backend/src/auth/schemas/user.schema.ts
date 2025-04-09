import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;
@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({default: ''})
    profileImg: string;

    @Prop({default: ''})
    backgroundImg: string;

    @Prop({default: 0})
    followerCount: number;

    @Prop({default: 0})
    followingCount: number;

    @Prop({default: 1000})
    totalPoints: number;

    @Prop({default: 'Beginner'})
    ranking: string;

    @Prop({default: ''})
    detail: string;
}

export const UserSchema = SchemaFactory.createForClass(User);