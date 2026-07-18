import { Controller, Post, Patch, Body, Param } from '@nestjs/common';
import { CreateIndicacaoUseCase, CreateIndicacaoRequest, CreateIndicacaoResponse } from './usecase/create-indicacao.usecase';
import { ActivateConsumerUseCase, ActivateConsumerResponse } from './usecase/activate-consumer.usecase';

@Controller('indicacao')
export class IndicacaoController {
  constructor(
    private readonly createIndicacaoUseCase: CreateIndicacaoUseCase,
    private readonly activateConsumerUseCase: ActivateConsumerUseCase,
  ) {}

  @Post()
  async createIndicacao(
    @Body() body: CreateIndicacaoRequest,
  ): Promise<CreateIndicacaoResponse> {
    return this.createIndicacaoUseCase.execute(body);
  }

  @Patch(':id/activate')
  async activateConsumer(
    @Param('id') id: string,
  ): Promise<ActivateConsumerResponse> {
    return this.activateConsumerUseCase.execute({ id });
  }
}
