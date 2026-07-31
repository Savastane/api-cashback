import { Test, TestingModule } from '@nestjs/testing';
import { CreateIndicacaoUseCase } from './create-indicacao.usecase';
import { CashbackConsumerRepository } from '../repository/cashback-consumer.repository';
import { CashbackConsumer } from '../../model/cashback-consumer.model';
import { BadRequestException } from '@nestjs/common';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: () => 'mocked-random-uuid',
}));

describe('CreateIndicacaoUseCase', () => {
  let useCase: CreateIndicacaoUseCase;
  let repository: jest.Mocked<Partial<CashbackConsumerRepository>>;

  const mockReferrer: CashbackConsumer = {
    id: 'referrer-uuid-1111',
    referral_code: 'referrer_nickname',
    referred_by: 'level2-uuid-2222',
    referred_by_level2: null,
    username: 'referrer_nickname',
    nickname: 'referrer_nickname',
    full_name: 'Referrer Name',
    referral_status: 'active',
    cashback_balance: 10.0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockNewConsumerInput = {
    id: 'new-uuid-9999',
    username: 'newUser',
    nickname: 'newUser',
    full_name: 'New User Name',
    referral_id: 'referrer-uuid-1111',
  };

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
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
    repository.findById!.mockImplementation(async (id) => {
      if (id === mockNewConsumerInput.id) {
        return null;
      }
      if (id === mockNewConsumerInput.referral_id) {
        return mockReferrer;
      }
      return null;
    });

    const expectedCreatedConsumer: CashbackConsumer = {
      id: mockNewConsumerInput.id,
      referral_code: 'mocked-random-uuid',
      referred_by: 'referrer-uuid-1111',
      referred_by_level2: 'level2-uuid-2222',
      username: mockNewConsumerInput.username,
      nickname: mockNewConsumerInput.nickname,
      full_name: mockNewConsumerInput.full_name,
      referral_status: 'pending',
      cashback_balance: 0.0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    repository.create!.mockResolvedValue(expectedCreatedConsumer);

    const result = await useCase.execute(mockNewConsumerInput);

    expect(repository.findById).toHaveBeenCalledWith(mockNewConsumerInput.id);
    expect(repository.findById).toHaveBeenCalledWith(mockNewConsumerInput.referral_id);
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
      id: mockNewConsumerInput.id,
      referral_code: 'mocked-random-uuid',
      referred_by: 'referrer-uuid-1111',
      referred_by_level2: 'level2-uuid-2222',
      username: mockNewConsumerInput.username,
      nickname: mockNewConsumerInput.nickname,
      full_name: mockNewConsumerInput.full_name,
      referral_status: 'pending',
      cashback_balance: 0.0,
    }));
    expect(result).toEqual(expectedCreatedConsumer);
  });

  it('should throw BadRequestException if consumer already exists in cashback network', async () => {
    repository.findById!.mockResolvedValue({ id: 'existing' } as CashbackConsumer);

    await expect(useCase.execute(mockNewConsumerInput)).rejects.toThrow(
      new BadRequestException('Consumidor já cadastrado na rede de cashback'),
    );
  });

  it('should throw BadRequestException if referrer does not exist', async () => {
    repository.findById!.mockImplementation(async (id) => {
      if (id === mockNewConsumerInput.id) {
        return null;
      }
      if (id === mockNewConsumerInput.referral_id) {
        return null;
      }
      return null;
    });

    await expect(useCase.execute(mockNewConsumerInput)).rejects.toThrow(
      new BadRequestException('Código de indicação inválido ou não encontrado'),
    );
  });
});

