import { Catch, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    // @ts-ignore
    const errcode = err.status || err.response?.status || 400;
    // 所有的未分类错误会到这里
    ctx.status = errcode;
    return {
      code: -1,
      message: err.message,
      data: null,
    };
  }
}
