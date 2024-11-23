import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { RoomService } from '../room/room.service';

@Injectable()
export class ParticipantGuard implements CanActivate {
  constructor(private readonly roomService: RoomService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Extract user from request
    const { roomId } = request.params;

    if (!user || !user.userId) {
      console.error('Invalid user object:', user);
      throw new UnauthorizedException('User not authenticated');
    }

    const room = await this.roomService.findOneById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const isParticipant = room.participants.some(
      (participant: any) => participant.toString() === user.userId,
    );

    console.log('Authenticated user ID:', user.userId);
    console.log('Room participants:', room.participants);
    console.log(
      'Comparison results:',
      room.participants.map((participant: any) => ({
        participant: participant.toString(),
        matches: participant.toString() === user.userId,
      })),
    );

    if (!isParticipant) {
      throw new UnauthorizedException('You are not a participant of this room');
    }

    return true;
  }
}
