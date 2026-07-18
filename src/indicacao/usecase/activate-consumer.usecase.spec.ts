import { Test, TestingModule } from '@nestjs/testing';
import { ActivateConsumerUseCase } from './activate-consumer.usecase';
import { CashbackConsumerRepository } from '../repository/cashback-consumer.repository';
import { CashbackConsumer } from '../../model/cashback-consumer.model';
import { BadRequestException } from '@nestjs/common';

describe('ActivateConsumerUseCase', () => {
  let useCase: ActivateConsumerUseCase;
  let repository: jest.Mocked<Partial<CashbackConsumerRepository>>;

  const mockConsumer: CashbackConsumer = {
    id: 'consumer-uuid-123',
    referral_code: 'REF123',
    referred_by: 'referrer-uuid',
    referred_by_level2: null,
    username: 'consumerUser',
    full_name: 'Consumer Name',
    referral_status: 'pending',
    cashback_balance: 0.0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivateConsumerUseCase,
        {
          provide: CashbackConsumerRepository,
          useValue: repository,
        },
      ],
    }).compile();

    useCase = module.get<ActivateConsumerUseCase>(ActivateConsumerUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should successfully update referral_status to active for a valid consumer', async () => {
    repository.findById!.mockResolvedValue(mockConsumer);
    
    const mockUpdatedConsumer: CashbackConsumer = {
      ...mockConsumer,
      referral_status: 'active',
      updated_at: new Date(),
    };

    repository.updateStatus!.mockResolvedValue(mockUpdatedConsumer);

    const result = await useCase.execute({ id: 'consumer-uuid-123' });

    expect(repository.findById).toHaveBeenCalledWith('consumer-uuid-123');
    expect(repository.updateStatus).toHaveBeenCalledWith('consumer-uuid-123', 'active');
    expect(result).toEqual(mockUpdatedConsumer);
  });

  it('should throw BadRequestException if consumer is not found', async () => {
    repository.findById!.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'non-existent-uuid' })).rejects.toThrow(
      new BadRequestException('Consumidor não encontrado na rede de cashback'),
    );
  });
});
