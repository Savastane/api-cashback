import { Controller, Post, Param } from '@nestjs/common';
import {
  DistribuirCashbackUseCase,
  DistribuirCashbackRequest,
  DistribuirCashbackResponse,
} from './usecase/distribuir-cashback.usecase';

@Controller('distribuicao')
export class DistribuicaoController {
  constructor(private readonly distribuirCashbackUseCase: DistribuirCashbackUseCase) { }

  @Post(':payable_id')
  async distribuir(
    @Param('payable_id') payable_id: string,
  ): Promise<DistribuirCashbackResponse> {
    const request: DistribuirCashbackRequest = { payable_id };
    return this.distribuirCashbackUseCase.execute(request);
  }
}
