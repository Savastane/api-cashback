import { Controller, Get, Param } from '@nestjs/common';
import { GetExtratoUseCase, GetExtratoResponse } from './usecase/get-extrato.usecase';

@Controller('extrato')
export class ExtratoController {
  constructor(private readonly getExtratoUseCase: GetExtratoUseCase) {}

  @Get(':consumerId')
  async getExtrato(@Param('consumerId') consumerId: string): Promise<GetExtratoResponse> {
    return this.getExtratoUseCase.execute({ consumerId });
  }
}
