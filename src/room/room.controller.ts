import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './schemas/room.schema';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('/create')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    try {
      const room = await this.roomService.create(createRoomDto);
      return { message: 'Room created successfully', room };
    } catch (error) {
      console.error('Error creating room:', error.message);
      return { message: 'Failed to create room', error: error.message };
    }
  }

  @Get('/all')
  async getAllRooms(): Promise<Room[] | { message: string }> {
    try {
      return await this.roomService.findAll();
    } catch (error) {
      console.error('Error fetching rooms:', error.message);
      return { message: 'Failed to fetch rooms' };
    }
  }

  @Get('/videos/:id')
  async getVideoRoom(@Param('id') id: string) {
    try {
      const videos = await this.roomService.getAllVideoByRoomId(id);
      if (!videos) {
        return { message: 'Videos not found for the specified room' };
      }
      return { message: 'Videos retrieved successfully', videos };
    } catch (error) {
      console.error('Error fetching videos for room:', error.message);
      return { message: 'Failed to fetch videos', error: error.message };
    }
  }
}
