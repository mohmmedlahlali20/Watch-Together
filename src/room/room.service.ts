import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private channelModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<RoomDocument> {
    const newRoom = new this.channelModel(createRoomDto);
    return await newRoom.save();
  }

  async findAll(): Promise<RoomDocument[]> {
    return await this.channelModel
      .find()
      .populate('participants')
      .populate('owner')
      .exec();
  }

  async findOneById(id: string): Promise<RoomDocument> {
    return await this.channelModel.findById(id).exec();
  }

  async updateById(
    id: string,
    updateRoomDto: CreateRoomDto,
  ): Promise<RoomDocument> {
    return await this.channelModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec();
  }

  async getAllVideoByRoomId(
    roomId: string,
  ): Promise<{ title: string; url: string }[]> {
    const room = await this.channelModel.findById(roomId).exec();
    if (!room) {
      throw new Error('Room not found');
    }
    return room.videos;
  }
}
