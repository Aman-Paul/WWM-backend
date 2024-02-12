import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatDto } from './dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {

  constructor(private chatSevices: ChatService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    this.chatSevices.handleConnection(socket);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    // Handle received message
    const dto: ChatDto = {
      server: this.server,
      socketId: client.id, 
      data
    }
    this.chatSevices.sendMessageToSocket(dto);
  }

}

