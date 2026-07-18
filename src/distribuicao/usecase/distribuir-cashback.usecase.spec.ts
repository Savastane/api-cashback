import { Test, TestingModule } from '@nestjs/testing';
import { DistribuirCashbackUseCase } from './distribuir-cashback.usecase';
import { PayableRepository } from '../repository/payable.repository';
import { CashbackRatesRepository } from '../repository/cashback-rates.repository';
import { CashbackTransactionRepository } from '../repository/cashback-transaction.repository';
import { CashbackConsumer } from '../../model/cashback-consumer.model';
import { CashbackRates } from '../../model/cashback-rates.model';
import { CashbackTransaction } from '../../model/cashback-transaction.model';
import { BadRequestException } from '@nestjs/common';

// ─── Dados de Fixtures ────────────────────────────────────────────────────────

const mockConsumer: CashbackConsumer = {
  id: 'consumer-nivel0-uuid',
  referral_code: 'REF000',
  referred_by: 'consumer-nivel1-uuid',
  referred_by_level2: 'consumer-nivel2-uuid',
  username: 'nivel0user',
  full_name: 'Nível 0',
  referral_status: 'active',
  cashback_balance: 0,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockPayable = {
  id: 'payable-uuid',
  partner_id: 'partner-uuid',
  consumer_id: 'consumer-nivel0-uuid',
  order_value: 100.0,
  order_id: 'order-uuid',
  status: 'paid',
};

const mockRates: CashbackRates = {
  id: 'rates-uuid',
  percentage_0: 5.0,
  percentage_1: 2.0,
  percentage_2: 1.0,
  active: true,
  created_at: new Date(),
};

const makeTx = (override: Partial<CashbackTransaction>): CashbackTransaction => ({
  id: 'tx-uuid',
  consumer_id: 'consumer-nivel0-uuid',
  type: 'purchase_cashback',
  direction: 'in',
  amount: 5.0,
  payable_id: 'payable-uuid',
  order_id: 'order-uuid',
  description: 'CashBack Compras',
  occurred_at: new Date(),
  created_at: new Date(),
  transaction_id: null,
  ...override,
});

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('DistribuirCashbackUseCase', () => {
  let useCase: DistribuirCashbackUseCase;
  let payableRepo: jest.Mocked<Pick<PayableRepository, 'findById'>>;
  let ratesRepo: jest.Mocked<Pick<CashbackRatesRepository, 'findActive'>>;
  let txRepo: jest.Mocked<Pick<CashbackTransactionRepository, 'create'>>;

  const mockConsumerRepo = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    payableRepo = { findById: jest.fn() };
    ratesRepo = { findActive: jest.fn() };
    txRepo = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistribuirCashbackUseCase,
        { provide: PayableRepository, useValue: payableRepo },
        { provide: CashbackRatesRepository, useValue: ratesRepo },
        { provide: CashbackTransactionRepository, useValue: txRepo },
        {
          provide: 'CASHBACK_CONSUMER_REPO',
          useValue: mockConsumerRepo,
        },
      ],
    }).compile();

    useCase = module.get<DistribuirCashbackUseCase>(DistribuirCashbackUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw BadRequestException when payable is not found', async () => {
    payableRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ payable_id: 'invalid-uuid' })).rejects.toThrow(
      new BadRequestException('Payable não encontrado'),
    );
  });

  it('should throw BadRequestException when payable has no consumer_id', async () => {
    payableRepo.findById.mockResolvedValue({ ...mockPayable, consumer_id: null });

    await expect(useCase.execute({ payable_id: 'payable-uuid' })).rejects.toThrow(
      new BadRequestException('Payable sem consumer_id vinculado'),
    );
  });

  it('should throw BadRequestException when payable has no order_value', async () => {
    payableRepo.findById.mockResolvedValue({ ...mockPayable, order_value: null });

    await expect(useCase.execute({ payable_id: 'payable-uuid' })).rejects.toThrow(
      new BadRequestException('Payable sem order_value definido'),
    );
  });

  it('should throw BadRequestException when no active cashback rate is found', async () => {
    payableRepo.findById.mockResolvedValue(mockPayable);
    mockConsumerRepo.findById.mockResolvedValue(mockConsumer);
    ratesRepo.findActive.mockResolvedValue(null);

    await expect(useCase.execute({ payable_id: 'payable-uuid' })).rejects.toThrow(
      new BadRequestException('Nenhuma taxa de cashback ativa encontrada'),
    );
  });

  it('should generate 3 transactions for nivel 0, 1 and 2', async () => {
    payableRepo.findById.mockResolvedValue(mockPayable);
    mockConsumerRepo.findById.mockResolvedValue(mockConsumer);
    ratesRepo.findActive.mockResolvedValue(mockRates);

    // order_value = 100, percentage_0 = 5% => 5.00
    // percentage_1 = 2% => 2.00
    // percentage_2 = 1% => 1.00
    txRepo.create
      .mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel0-uuid', amount: 5.0 }))
      .mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel1-uuid', amount: 2.0, type: 'referral_cashback', description: 'CashBack Compras Indicado' }))
      .mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel2-uuid', amount: 1.0, type: 'referral_cashback', description: 'CashBack Compras Indicado' }));

    const result = await useCase.execute({ payable_id: 'payable-uuid' });

    expect(result.transactions).toHaveLength(3);
    expect(result.transactions[0].consumer_id).toBe('consumer-nivel0-uuid');
    expect(result.transactions[0].amount).toBe(5.0);
    expect(result.transactions[0].type).toBe('purchase_cashback');

    expect(result.transactions[1].consumer_id).toBe('consumer-nivel1-uuid');
    expect(result.transactions[1].amount).toBe(2.0);
    expect(result.transactions[1].type).toBe('referral_cashback');

    expect(result.transactions[2].consumer_id).toBe('consumer-nivel2-uuid');
    expect(result.transactions[2].amount).toBe(1.0);
    expect(result.transactions[2].type).toBe('referral_cashback');
  });

  it('should skip nivel 1 transaction if consumer has no referred_by', async () => {
    payableRepo.findById.mockResolvedValue(mockPayable);
    mockConsumerRepo.findById.mockResolvedValue({ ...mockConsumer, referred_by: null, referred_by_level2: null });
    ratesRepo.findActive.mockResolvedValue(mockRates);

    txRepo.create.mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel0-uuid', amount: 5.0 }));

    const result = await useCase.execute({ payable_id: 'payable-uuid' });

    expect(result.transactions).toHaveLength(1);
  });
});
