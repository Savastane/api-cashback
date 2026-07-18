import { Test, TestingModule } from '@nestjs/testing';
import { GetIndicadosUseCase } from './get-indicados.usecase';
import { CashbackConsumerRepository } from '../repository/cashback-consumer.repository';
import { CashbackConsumer } from '../../model/cashback-consumer.model';

describe('GetIndicadosUseCase', () => {
  let useCase: GetIndicadosUseCase;
  let repository: jest.Mocked<Partial<CashbackConsumerRepository>>;

  const mockReferrals: CashbackConsumer[] = [
    {
      id: 'referral-1',
      referral_code: 'REF1',
      referred_by: 'my-consumer-id',
      referred_by_level2: 'grandparent-id',
      username: 'user1',
      full_name: 'User One',
      referral_status: 'active',
      cashback_balance: 10,
      created_at: new Date('2026-07-18T00:00:00Z'),
      updated_at: new Date(),
    },
    {
      id: 'referral-2',
      referral_code: 'REF2',
      referred_by: 'parent-id',
      referred_by_level2: 'my-consumer-id',
      username: 'user2',
      full_name: 'User Two',
      referral_status: 'pending',
      cashback_balance: 0,
      created_at: new Date('2026-07-18T01:00:00Z'),
      updated_at: new Date(),
    },
  ];

  beforeEach(async () => {
    repository = {
      findReferrals: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetIndicadosUseCase,
        {
          provide: CashbackConsumerRepository,
          useValue: repository,
        },
      ],
    }).compile();

    useCase = module.get<GetIndicadosUseCase>(GetIndicadosUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should successfully map referrals to level 1 and level 2 based on consumerId', async () => {
    repository.findReferrals!.mockResolvedValue(mockReferrals);

    const result = await useCase.execute({ consumerId: 'my-consumer-id' });

    expect(repository.findReferrals).toHaveBeenCalledWith('my-consumer-id');
    expect(result.indicados).toHaveLength(2);

    expect(result.indicados[0]).toEqual({
      id: 'referral-1',
      username: 'user1',
      full_name: 'User One',
      referral_status: 'active',
      level: 1,
      created_at: mockReferrals[0].created_at,
    });

    expect(result.indicados[1]).toEqual({
      id: 'referral-2',
      username: 'user2',
      full_name: 'User Two',
      referral_status: 'pending',
      level: 2,
      created_at: mockReferrals[1].created_at,
    });
  });
});
