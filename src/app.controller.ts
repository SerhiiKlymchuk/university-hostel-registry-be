import { Controller, Get, OnApplicationBootstrap } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { ROLES } from './user/schemas/user.schema';

@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  async onApplicationBootstrap() {
    const hasAdmin = await this.userService.findOneByRole(ROLES.ADMIN);

    if(!hasAdmin) {
      this.userService.createAdmin();
    }
  }
}
