import { Controller, Get } from '@midwayjs/core';
import { ApiTags } from '@midwayjs/swagger';

@Controller('/')
@ApiTags(['/'])
export class AppController {
  @Get('/health')
  async check() {
    return 'ok';
  }
}
