import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Socket} from 'socket.io';
import {Repository} from 'typeorm';
import {User} from '../auth/entities';

interface Client {
  socket: Socket
  user: User
}

@Injectable()
export class MessagesService {
  private connectedClients: Map<string, Client> = new Map<string, Client>()

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  get connectedClientsCount(): number {
    return this.connectedClients.size;
  }

  get connectedClientsNames(): string[] {
    return Array.from(this.connectedClients.values()).map((client) => {
      return client.user.fullName
    })
  }

  async registerClient(client: Socket, userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({id: userId});
    if (!user) {
      throw new Error('User not found')
    } else if (!user.isActive) {
      throw new Error('User not active')
    }
    this.connectedClients.set(client.id, {socket: client, user});
  }

  removeClient(client: Socket): void {
    this.connectedClients.delete(client.id);
  }

  getUserFullNameByClient(client: Socket): string {
    return this.connectedClients.get(client.id).user.fullName
  }
}
