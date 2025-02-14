import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({defailt: ''})
    profileImg: string;

    @Prop({default: ''})
    backgroundImg: string;

    @Prop({default: 1000})
    totalPoints: number;
}

export const UserSchema = SchemaFactory.createForClass(User);