import {Logger} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {IncomeMessageDto, OutgoingMessageDto} from './dtos';
import {MessagesService} from './messages.service';

@WebSocketGateway({cors: true})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private logger = new Logger('MessagesGateway')

  @WebSocketServer()
  private webSocketServer: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly tokenService: JwtService,
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string
    try {
      const payload = this.tokenService.verify(token)
      await this.messagesService.registerClient(client, payload.id);
      this.webSocketServer.emit('clients-updated', this.messagesService.connectedClientsNames);

      this.logger.log('A new client has connected');
      this.logger.log(`Total clients connected: ${this.messagesService.connectedClientsCount}`);
    } catch (err) {
      client.disconnect()
      return
    }
  }

  async handleDisconnect(client: Socket) {
    this.messagesService.removeClient(client);
    this.webSocketServer.emit('clients-updated', this.messagesService.connectedClientsNames);

    this.logger.log('A new client has disconnected');
    this.logger.log(`Total clients connected: ${this.messagesService.connectedClientsCount}`);
  }

  @SubscribeMessage('message-form-client')
  onMessageFromClient(client: Socket, payload: IncomeMessageDto) {
    this.webSocketServer.emit(
      'new-message',
      {
        ...payload,
        fullName: this.messagesService.getUserFullNameByClient(client),
      } as OutgoingMessageDto,
    )
  }
}
