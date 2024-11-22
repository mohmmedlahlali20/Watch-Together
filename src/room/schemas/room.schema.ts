import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({
    type: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    default: [],
  })
  videos: { title: string; url: string }[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  participants: Types.ObjectId[];

  @Prop({ type: Date, required: true })
  startTime: Date;

  @Prop({ type: Date, required: true })
  endTime: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
