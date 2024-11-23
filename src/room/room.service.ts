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
    return this.channelModel
      .find()
      .populate('participants')
      .populate('owner')
      .exec();
  }

  async findOneById(id: string): Promise<RoomDocument> {
    return this.channelModel.findById(id).exec();
  }

  async updateById(
    id: string,
    updateRoomDto: CreateRoomDto,
  ): Promise<RoomDocument> {
    return this.channelModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec();
  }

  async getAllVideoByRoomId(roomId: string): Promise<any[]> {
    const room = await this.channelModel.findById(roomId).exec();
    return room ? room.videos : [];
  }
}
