import { Catch, MidwayHttpError, httpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(_err: MidwayHttpError, ctx: Context) {
    // 404 错误会到这里
    ctx.status = 404;
    return {
      code: -1,
      error: 'Not Found',
      data: null,
    };
  }
}
