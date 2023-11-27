import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { ApiResponse } from '@midwayjs/swagger';

import { SuccessWrapper } from '../utils/success-wraper';

import { UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  @Inject()
  service: UserService;

  @Post('/')
  @ApiResponse({
    status: 200,
    description: 'users module',
    type: SuccessWrapper(UserDTO),
  })
  async createUser(@Body() user: UserDTO) {
    return this.service.createUser(user);
  }
}
