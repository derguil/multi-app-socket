"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let ChatGateway = class ChatGateway {
    server;
    handleConnection(client) {
        console.log(`Socket connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Socket disconnected: ${client.id}`);
    }
    handleJoinRoom(client, payload) {
        if (!payload.roomId) {
            return { success: false, message: 'roomId is required' };
        }
        const room = `chat-room:${payload.roomId}`;
        client.join(room);
        return { success: true, roomId: payload.roomId, room };
    }
    handleLeaveRoom(client, payload) {
        if (!payload.roomId) {
            return { success: false, message: 'roomId is required' };
        }
        const room = `chat-room:${payload.roomId}`;
        client.leave(room);
        return { success: true, roomId: payload.roomId, room };
    }
    handleChatSend(payload, client) {
        this.server.emit('chat:message', {
            senderId: client.id,
            message: payload.message,
            sentAt: new Date().toISOString(),
        });
    }
    handleRoomChatSend(payload, client) {
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
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChatRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Object)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveChatRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Object)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:send'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleChatSend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:send:room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Object)
], ChatGateway.prototype, "handleRoomChatSend", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'chat' })
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map