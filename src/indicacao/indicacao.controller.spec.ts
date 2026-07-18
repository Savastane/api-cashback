import { Test, TestingModule } from '@nestjs/testing';
import { IndicacaoController } from './indicacao.controller';
import { CreateIndicacaoUseCase } from './usecase/create-indicacao.usecase';
import { ActivateConsumerUseCase } from './usecase/activate-consumer.usecase';

describe('IndicacaoController', () => {
  let controller: IndicacaoController;
  let createUseCase: CreateIndicacaoUseCase;
  let activateUseCase: ActivateConsumerUseCase;

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
      ],
    }).compile();

    controller = module.get<IndicacaoController>(IndicacaoController);
    createUseCase = module.get<CreateIndicacaoUseCase>(CreateIndicacaoUseCase);
    activateUseCase = module.get<ActivateConsumerUseCase>(ActivateConsumerUseCase);
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
});
