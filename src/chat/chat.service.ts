import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto';

@Injectable()
export class ChatService {

// Function to send a message to a particular socket
  sendMessageToSocket(dto: ChatDto) {
    const socket = dto.server.sockets.sockets.get(dto.socketId);
    if(socket) {
      socket.emit('message', dto.data);
    } else {
      console.log('Scoket not found.');
    }
  }
}
