import {Module} from '@nestjs/common';
import {AuthModule} from 'src/auth/auth.module';
import {MessagesGateway} from './messages.gateway';
import {MessagesService} from './messages.service';

@Module({
  imports: [
    AuthModule,
  ],
  providers: [
    MessagesGateway,
    MessagesService,
  ],
})
export class MessagesModule { }
