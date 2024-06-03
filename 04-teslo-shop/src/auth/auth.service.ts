import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private handleDBErrors(error: any): never {
    if (error.code === '23505') 
      throw new BadRequestException(error.detail);
    
    console.log(error);
    throw new InternalServerErrorException('Check server logs');
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign( payload );
    return token
  }
  
  async registerUser(createUserDto: CreateUserDto) {
    try {
      const {password, ...userData} = createUserDto
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
      });
      await this.userRepository.save(user)
      delete user.password
      return {...user, token: this.getJwtToken({id: user.id, email: user.email})}
    } catch (err) {
      this.handleDBErrors(err);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const {email, password} = loginUserDto
      const user = await this.userRepository.findOne({
        where: {email},
        select: {id: true, email: true, password: true}
      });

      if (!user || !bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Non valid credentials');

      delete user.password
      return {...user, token: this.getJwtToken({id: user.id, email: user.email})}
    } catch (err) {
      this.handleDBErrors(err)
    }
  }
}
