import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Authorize, GetUser, RoleProtected } from './decorators';
import { User } from './entities';
import { UserRolesGuard } from './guards';
import { ValidRoles } from './interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto)
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto)
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
  ) {
    console.log(user)
    return {
      ok: true,
      message: 'Hello world private',
    }
  }

  @Get('private2')
  @RoleProtected(ValidRoles.ADMIN, ValidRoles.SUDO)
  @UseGuards(AuthGuard(), UserRolesGuard)
  testingPrivate2Route(
    @GetUser() user: User,
  ) {
    console.log(user)
    return {
      ok: true,
      message: 'Hello world private',
    }
  }

  @Get('private3')
  @Authorize(ValidRoles.ADMIN, ValidRoles.SUDO)
  testingPrivate3Route(
    @GetUser() user: User,
  ) {
    console.log(user)
    return {
      ok: true,
      message: 'Hello world private',
    }
  }
}
