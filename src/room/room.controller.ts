import { Controller, Post, Body, Get, Param, Res, UseGuards } from "@nestjs/common";
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './schemas/room.schema';
import { ParticipantGuard } from "../guards/participant.guard";
import { JwtGuard } from "../guards/jwt.guard";

@Controller('rooms')
@UseGuards(JwtGuard)
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
      if (!videos || videos.length === 0) {
        return { message: 'Videos not found for the specified room' };
      }
      return { message: 'Videos retrieved successfully', videos };
    } catch (error) {
      console.error('Error fetching videos for room:', error.message);
      return { message: 'Failed to fetch videos', error: error.message };
    }
  }

  @Get(':roomId/playlist')
  @UseGuards(ParticipantGuard)
  async getPlaylist(@Param('roomId') roomId: string) {
    try {
      const playlist = await this.roomService.getVideosByRoomId(roomId);

      if (!playlist || playlist.length === 0) {
        return { message: 'No playlist found for the specified room', playlist: [] };
      }

      return { message: 'Playlist retrieved successfully', playlist };
    } catch (error) {
      console.error('Error fetching playlist for room:', error.message);
      return {
        message: 'Failed to fetch playlist',
        error: error.message,
      };
    }
  }

  @Get('/GetRoomById/:roomId')
  async getRoomByIdParticipants(@Param('roomId') roomId: string) {
    try {
      const participants =
        await this.roomService.getRoomByIdParticipants(roomId);

      if (!participants || participants.length === 0) {
        return { message: 'No participants found for this room' };
      }

      return { message: 'Participants retrieved successfully', participants };
    } catch (error) {
      console.error('Error fetching room participants:', error.message);
      return { message: 'Failed to fetch participants', error: error.message };
    }
  }

  @Get(':roomId')
  async getOneRoom(@Param('roomId') roomId: string){
    try {
      const room = await this.roomService.findOneById(roomId);
      console.log(room);
      return {message: 'Room found', room}
    }catch (e) {
      console.log('err getting');
    }
  }
}
