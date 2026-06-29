import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ChatPayload {
  message: string;
}

interface JoinChatRoomPayload {
  roomId: string;
}

interface LeaveChatRoomPayload {
  roomId: string;
}

interface RoomChatPayload {
  roomId: string;
  message: string;
}

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket): void {
    console.log(`Socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChatRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinChatRoomPayload,
  ): { success: boolean; roomId?: string; room?: string; message?: string } {
    if (!payload.roomId) {
      return { success: false, message: 'roomId is required' };
    }

    const room = `chat-room:${payload.roomId}`;
    client.join(room);

    return { success: true, roomId: payload.roomId, room };
  }

  @SubscribeMessage('leaveChatRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LeaveChatRoomPayload,
  ): { success: boolean; roomId?: string; room?: string; message?: string } {
    if (!payload.roomId) {
      return { success: false, message: 'roomId is required' };
    }

    const room = `chat-room:${payload.roomId}`;
    client.leave(room);

    return { success: true, roomId: payload.roomId, room };
  }

  @SubscribeMessage('chat:send')
  handleChatSend(
    @MessageBody() payload: ChatPayload,
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('chat:message', {
      senderId: client.id,
      message: payload.message,
      sentAt: new Date().toISOString(),
    });
  }

  @SubscribeMessage('chat:send:room')
  handleRoomChatSend(
    @MessageBody() payload: RoomChatPayload,
    @ConnectedSocket() client: Socket,
  ): { success: boolean; message?: string } {
    if (!payload.roomId || !payload.message) {
      return { success: false, message: 'roomId and message are required' };
    }

    const room = `chat-room:${payload.roomId}`;

    if (!client.rooms.has(room)) {
      return { success: false, message: 'You are not in this room' };
    }

    this.server.to(room).emit('chat:message', {
      senderId: client.id,
      roomId: payload.roomId,
      message: payload.message,
      sentAt: new Date().toISOString(),
    });

    return { success: true };
  }
}