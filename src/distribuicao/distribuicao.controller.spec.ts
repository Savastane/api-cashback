import { Test, TestingModule } from '@nestjs/testing';
import { DistribuicaoController } from './distribuicao.controller';
import { DistribuirCashbackUseCase } from './usecase/distribuir-cashback.usecase';
import { CashbackTransaction } from '../model/cashback-transaction.model';

describe('DistribuicaoController', () => {
  let controller: DistribuicaoController;
  let useCase: DistribuirCashbackUseCase;

  const mockTx: CashbackTransaction = {
    id: 'tx-uuid',
    consumer_id: 'consumer-uuid',
    type: 'purchase_cashback',
    direction: 'in',
    amount: 5.0,
    payable_id: 'payable-uuid',
    order_id: 'order-uuid',
    description: 'CashBack Compras',
    occurred_at: new Date(),
    created_at: new Date(),
    transaction_id: null,
  };

  const mockResponse = {
    payable_id: 'payable-uuid',
    order_value: 100.0,
    transactions: [mockTx],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistribuicaoController],
      providers: [
        {
          provide: DistribuirCashbackUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<DistribuicaoController>(DistribuicaoController);
    useCase = module.get<DistribuirCashbackUseCase>(DistribuirCashbackUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call useCase.execute with payable_id from params and return the result', async () => {
    const spy = jest.spyOn(useCase, 'execute');
    const result = await controller.distribuir('payable-uuid');

    expect(spy).toHaveBeenCalledWith({ payable_id: 'payable-uuid' });
    expect(result).toEqual(mockResponse);
  });
});
