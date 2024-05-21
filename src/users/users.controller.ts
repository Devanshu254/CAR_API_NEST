import { Body,Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, Session, UseGuards } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CreateUserDto } from './dtos/create-users.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
// import { AuthGuard } from 'src/guards/auth.guard';
import { AuthGuard } from '../guards/auth.guard';


@Controller('auth') // We have updated from {user} to {auth}.
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService,
        private authService: AuthService
    ) {}

    @Get('/colors/:color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color;
    }
    @Get('/colors')
    getColor(@Session() session: any) {
        return session.color;
    }

    // @Get('/whoami')
    // whoAmI(@Session() session: any){
    //     this.usersService.findOne(session.userId);
    // }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        // Here we definitely need to receive and validate our request.
        // Remember to setup validation we are going to create DTO, class validator package.
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }
    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }
    // @UseInterceptors(new SerializeInterceptor(UserDto))
    // @Serialize(UserDto)
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        // console.log('Handler is running');
        const user = await this.usersService.findOne(parseInt(id));
        if(!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }
    @Delete('/:id')
    removeUser(@Param('id') id:string) {
        return this.usersService.remove(parseInt(id));
    }
    @Patch('/:id')
    UpdateUser(@Param('id') id:string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }

}
