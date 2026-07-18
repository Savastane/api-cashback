import { Controller, Post, Patch, Get, Body, Param } from '@nestjs/common';
import { CreateIndicacaoUseCase, CreateIndicacaoRequest, CreateIndicacaoResponse } from './usecase/create-indicacao.usecase';
import { ActivateConsumerUseCase, ActivateConsumerResponse } from './usecase/activate-consumer.usecase';
import { GetIndicadosUseCase, GetIndicadosResponse } from './usecase/get-indicados.usecase';

@Controller('indicacao')
export class IndicacaoController {
  constructor(
    private readonly createIndicacaoUseCase: CreateIndicacaoUseCase,
    private readonly activateConsumerUseCase: ActivateConsumerUseCase,
    private readonly getIndicadosUseCase: GetIndicadosUseCase,
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

  @Get(':consumerId/indicados')
  async getIndicados(
    @Param('consumerId') consumerId: string,
  ): Promise<GetIndicadosResponse> {
    return this.getIndicadosUseCase.execute({ consumerId });
  }
}
