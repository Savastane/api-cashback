import { Test, TestingModule } from '@nestjs/testing';
import { CreateIndicacaoUseCase } from './create-indicacao.usecase';
import { CashbackConsumerRepository } from '../repository/cashback-consumer.repository';
import { CashbackConsumer } from '../../model/cashback-consumer.model';
import { BadRequestException } from '@nestjs/common';

describe('CreateIndicacaoUseCase', () => {
  let useCase: CreateIndicacaoUseCase;
  let repository: jest.Mocked<Partial<CashbackConsumerRepository>>;

  const mockReferrer: CashbackConsumer = {
    id: 'referrer-uuid-1111',
    referral_code: 'REF123',
    referred_by: 'level2-uuid-2222',
    referred_by_level2: null,
    username: 'referrerUser',
    full_name: 'Referrer Name',
    referral_status: 'active',
    cashback_balance: 10.0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockNewConsumerInput = {
    id: 'new-uuid-9999',
    username: 'newUser',
    full_name: 'New User Name',
    referralCodeUsed: 'REF123',
  };

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      findByReferralCode: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateIndicacaoUseCase,
        {
          provide: CashbackConsumerRepository,
          useValue: repository,
        },
      ],
    }).compile();

    useCase = module.get<CreateIndicacaoUseCase>(CreateIndicacaoUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should successfully create a new cashback consumer with correct level 1 and level 2 referrers', async () => {
    repository.findById!.mockResolvedValue(null);
    repository.findByReferralCode!.mockResolvedValue(mockReferrer);
    
    const expectedCreatedConsumer: CashbackConsumer = {
      id: mockNewConsumerInput.id,
      referral_code: 'newuser',
      referred_by: 'referrer-uuid-1111',
      referred_by_level2: 'level2-uuid-2222',
      username: mockNewConsumerInput.username,
      full_name: mockNewConsumerInput.full_name,
      referral_status: 'pending',
      cashback_balance: 0.0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    repository.create!.mockResolvedValue(expectedCreatedConsumer);

    const result = await useCase.execute(mockNewConsumerInput);

    expect(repository.findById).toHaveBeenCalledWith(mockNewConsumerInput.id);
    expect(repository.findByReferralCode).toHaveBeenCalledWith('REF123');
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
      id: mockNewConsumerInput.id,
      referral_code: 'newuser',
      referred_by: 'referrer-uuid-1111',
      referred_by_level2: 'level2-uuid-2222',
      username: mockNewConsumerInput.username,
      full_name: mockNewConsumerInput.full_name,
      referral_status: 'pending',
      cashback_balance: 0.0,
    }));
    expect(result).toEqual(expectedCreatedConsumer);
  });

  it('should throw BadRequestException if consumer already exists', async () => {
    repository.findById!.mockResolvedValue({ id: 'existing' } as CashbackConsumer);

    await expect(useCase.execute(mockNewConsumerInput)).rejects.toThrow(
      new BadRequestException('Consumidor já cadastrado na rede de cashback'),
    );
  });

  it('should throw BadRequestException if referral code used does not exist', async () => {
    repository.findById!.mockResolvedValue(null);
    repository.findByReferralCode!.mockResolvedValue(null);

    await expect(useCase.execute(mockNewConsumerInput)).rejects.toThrow(
      new BadRequestException('Código de indicação inválido ou não encontrado'),
    );
  });
});
