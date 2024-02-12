import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {

    private readonly connectedClients: Map<string, Socket> = new Map();
    handleConnection(socket: Socket) {
        const clientId = socket.id;
        this.connectedClients.set(clientId, socket);

        console.log("Connected Clients",[...this.connectedClients.keys()]);

        socket.on('disconnect', () => {
            this.connectedClients.delete(clientId);
            console.log(`Clients after disconnecting ${clientId}`,[...this.connectedClients.keys()]);
        });
    }

    // Function to send a message to a particular socket
    sendMessageToSocket(dto: ChatDto) {
        const socket = dto.server.sockets.sockets.get(dto.socketId);
        if (socket) {
            socket.emit('message', dto.data);
        } else {
            console.log('Scoket not found.');
        }
    }
}
