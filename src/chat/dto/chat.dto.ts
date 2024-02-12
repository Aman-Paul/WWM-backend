import { Server } from 'socket.io';

export interface ChatDto {
    server: Server,
    socketId: string, 
    data: string
}
