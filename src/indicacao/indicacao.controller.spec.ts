import { Test, TestingModule } from '@nestjs/testing';
import { IndicacaoController } from './indicacao.controller';
import { CreateIndicacaoUseCase } from './usecase/create-indicacao.usecase';
import { ActivateConsumerUseCase } from './usecase/activate-consumer.usecase';
import { GetIndicadosUseCase } from './usecase/get-indicados.usecase';

describe('IndicacaoController', () => {
  let controller: IndicacaoController;
  let createUseCase: CreateIndicacaoUseCase;
  let activateUseCase: ActivateConsumerUseCase;
  let getIndicadosUseCase: GetIndicadosUseCase;

  const mockCreatedConsumer = {
    id: 'new-uuid',
    username: 'newuser',
    full_name: 'New User',
    referral_code: 'newuser',
    referred_by: 'referrer-uuid',
    referred_by_level2: 'level2-uuid',
    referral_status: 'pending' as const,
    cashback_balance: 0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockActiveConsumer = {
    ...mockCreatedConsumer,
    referral_status: 'active' as const,
  };

  const mockIndicados = {
    indicados: [
      {
        id: 'referral-1',
        username: 'user1',
        full_name: 'User One',
        referral_status: 'active',
        level: 1 as const,
        created_at: new Date(),
      },
    ],
  };

  const mockDto = {
    id: 'new-uuid',
    username: 'newuser',
    full_name: 'New User',
    referralCodeUsed: 'REF123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndicacaoController],
      providers: [
        {
          provide: CreateIndicacaoUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockCreatedConsumer),
          },
        },
        {
          provide: ActivateConsumerUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockActiveConsumer),
          },
        },
        {
          provide: GetIndicadosUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockIndicados),
          },
        },
      ],
    }).compile();

    controller = module.get<IndicacaoController>(IndicacaoController);
    createUseCase = module.get<CreateIndicacaoUseCase>(CreateIndicacaoUseCase);
    activateUseCase = module.get<ActivateConsumerUseCase>(ActivateConsumerUseCase);
    getIndicadosUseCase = module.get<GetIndicadosUseCase>(GetIndicadosUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createUseCase.execute with the correct arguments and return the result', async () => {
    const spy = jest.spyOn(createUseCase, 'execute');
    const result = await controller.createIndicacao(mockDto);

    expect(spy).toHaveBeenCalledWith(mockDto);
    expect(result).toEqual(mockCreatedConsumer);
  });

  it('should call activateUseCase.execute with the correct id and return the result', async () => {
    const spy = jest.spyOn(activateUseCase, 'execute');
    const result = await controller.activateConsumer('new-uuid');

    expect(spy).toHaveBeenCalledWith({ id: 'new-uuid' });
    expect(result).toEqual(mockActiveConsumer);
  });

  it('should call getIndicadosUseCase.execute with the correct consumerId and return the result', async () => {
    const spy = jest.spyOn(getIndicadosUseCase, 'execute');
    const result = await controller.getIndicados('my-consumer-id');

    expect(spy).toHaveBeenCalledWith({ consumerId: 'my-consumer-id' });
    expect(result).toEqual(mockIndicados);
  });
});
