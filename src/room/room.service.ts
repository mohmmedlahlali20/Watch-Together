import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private RoomModel: Model<RoomDocument>) {}

  async create(createRoomDto: CreateRoomDto): Promise<RoomDocument> {
    const newRoom = new this.RoomModel(createRoomDto);
    return await newRoom.save();
  }

  async findAll(): Promise<RoomDocument[]> {
    return this.RoomModel.find()
      .populate('participants')
      .populate('owner')
      .exec();
  }

  async updateById(
    id: string,
    updateRoomDto: CreateRoomDto,
  ): Promise<RoomDocument> {
    return this.RoomModel.findByIdAndUpdate(id, updateRoomDto, {
      new: true,
    }).exec();
  }

  async getAllVideoByRoomId(roomId: string): Promise<any[]> {
    const room = await this.RoomModel.findById(roomId).exec();
    return room ? room.videos : [];
  }

  async getVideosByRoomId(
    roomId: string,
  ): Promise<{ title: string; url: string }[]> {
    const room = await this.RoomModel.findById(roomId)
      .populate('participants', '_id')
      .exec();

    if (!room) {
      throw new Error('Room not found');
    }

    return room.videos;
  }
  async findOneById(roomId: string): Promise<Room> {
    const room = this.RoomModel.findById(roomId).exec();
    console.log(room);
    return room;
  }

  async getRoomByIdParticipants(roomId: string): Promise<any[]> {
    const room = await this.RoomModel.findById(roomId)
      .populate('participants', 'username email')
      .exec();

    if (!room) {
      throw new Error('Room not found');
    }

    return room.participants;
  }
}
