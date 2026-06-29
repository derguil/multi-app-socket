import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
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
export declare class ChatGateway implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, payload: JoinChatRoomPayload): {
        success: boolean;
        roomId?: string;
        room?: string;
        message?: string;
    };
    handleLeaveRoom(client: Socket, payload: LeaveChatRoomPayload): {
        success: boolean;
        roomId?: string;
        room?: string;
        message?: string;
    };
    handleChatSend(payload: ChatPayload, client: Socket): void;
    handleRoomChatSend(payload: RoomChatPayload, client: Socket): {
        success: boolean;
        message?: string;
    };
}
export {};
