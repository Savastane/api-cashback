import { Test, TestingModule } from '@nestjs/testing';
import { DistribuirCashbackUseCase } from './distribuir-cashback.usecase';
import { PayableRepository } from '../repository/payable.repository';
import { CashbackRatesRepository } from '../repository/cashback-rates.repository';
import { CashbackTransactionRepository } from '../repository/cashback-transaction.repository';
import { ConsumerRepository } from '../repository/consumer.repository';
import { PartnerRepository } from '../repository/partner.repository';
import { ProduceService } from '../../service/produce.service';
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
  nickname: 'nivel0user',
  full_name: 'Nível 0',
  referral_status: 'active',
  cashback_balance: 0,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockConsumerNivel1: CashbackConsumer = {
  id: 'consumer-nivel1-uuid',
  referral_code: 'REF001',
  referred_by: 'consumer-nivel2-uuid',
  referred_by_level2: null,
  username: 'nivel1user',
  nickname: 'nivel1user',
  full_name: 'Nível 1',
  referral_status: 'active',
  cashback_balance: 0,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockConsumerNivel2: CashbackConsumer = {
  id: 'consumer-nivel2-uuid',
  referral_code: 'REF002',
  referred_by: null,
  referred_by_level2: null,
  username: 'nivel2user',
  nickname: 'nivel2user',
  full_name: 'Nível 2',
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
  consumer_name: 'Nível 0',
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

const mockPhoneMap = new Map<string, string>([
  ['consumer-nivel0-uuid', '5511999990000'],
  ['consumer-nivel1-uuid', '5511999990001'],
  ['consumer-nivel2-uuid', '5511999990002'],
]);

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('DistribuirCashbackUseCase', () => {
  let useCase: DistribuirCashbackUseCase;
  let payableRepo: jest.Mocked<Pick<PayableRepository, 'findById'>>;
  let ratesRepo: jest.Mocked<Pick<CashbackRatesRepository, 'findActive'>>;
  let txRepo: jest.Mocked<Pick<CashbackTransactionRepository, 'create' | 'findDistributedByPayableId'>>;
  let produceService: jest.Mocked<Pick<ProduceService, 'publish'>>;

  const mockConsumerRepo = {
    findById: jest.fn(),
  };
  const mockPublicConsumerRepo = {
    findPhonesByIds: jest.fn().mockResolvedValue(mockPhoneMap),
  };
  const mockPartnerRepo = {
    findNameById: jest.fn().mockResolvedValue('Loja Teste'),
  };

  /** Configura o mockConsumerRepo.findById para retornar o consumer correto por ID */
  function setupConsumerRepoForThreeLevels() {
    mockConsumerRepo.findById.mockImplementation(async (id: string) => {
      if (id === 'consumer-nivel0-uuid') return mockConsumer;
      if (id === 'consumer-nivel1-uuid') return mockConsumerNivel1;
      if (id === 'consumer-nivel2-uuid') return mockConsumerNivel2;
      return null;
    });
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    payableRepo = { findById: jest.fn() };
    ratesRepo = { findActive: jest.fn() };
    txRepo = { create: jest.fn(), findDistributedByPayableId: jest.fn().mockResolvedValue([]) };
    produceService = { publish: jest.fn().mockResolvedValue({} as any) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistribuirCashbackUseCase,
        { provide: PayableRepository, useValue: payableRepo },
        { provide: CashbackRatesRepository, useValue: ratesRepo },
        { provide: CashbackTransactionRepository, useValue: txRepo },
        { provide: ConsumerRepository, useValue: mockPublicConsumerRepo },
        { provide: PartnerRepository, useValue: mockPartnerRepo },
        { provide: ProduceService, useValue: produceService },
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
    setupConsumerRepoForThreeLevels();
    ratesRepo.findActive.mockResolvedValue(mockRates);

    // order_value = 100, percentage_0 = 5% => 5.00
    // percentage_1 = 2% => 2.00
    // percentage_2 = 1% => 1.00
    txRepo.create
      .mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel0-uuid', amount: 5.0 }))
      .mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel1-uuid', amount: 2.0, type: 'referral_cashback', description: 'CashBack Compras Indicado' }))
      .mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel2-uuid', amount: 1.0, type: 'referral_cashback', description: 'CashBack Compras Indicado' }));

    const result = await useCase.execute({ payable_id: 'payable-uuid' });

    expect(result.already_distributed).toBe(false);
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

  it('should publish messages to compra and rede queues after distribution', async () => {
    payableRepo.findById.mockResolvedValue(mockPayable);
    setupConsumerRepoForThreeLevels();
    ratesRepo.findActive.mockResolvedValue(mockRates);

    txRepo.create
      .mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel0-uuid', amount: 5.0 }))
      .mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel1-uuid', amount: 2.0, type: 'referral_cashback', description: 'CashBack Compras Indicado' }))
      .mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel2-uuid', amount: 1.0, type: 'referral_cashback', description: 'CashBack Compras Indicado' }));

    await useCase.execute({ payable_id: 'payable-uuid' });

    expect(produceService.publish).toHaveBeenCalledTimes(3);

    // Compra (nível 0)
    expect(produceService.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        exchange: 'whatsapp',
        queue: 'whatsapp_cashback_compra',
        routingKey: 'cashback-compra',
        data: expect.objectContaining({
          phone: '5511999990000',
          consumerName: 'Nível 0',
          cashbackValor: '5.00',
          origemName: 'Loja Teste',
          redeNome: 'Loja Teste',
          cashbackValor1: '3.00',
        }),
      }),
    );

    // Rede nível 1
    expect(produceService.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        exchange: 'whatsapp',
        queue: 'whatsapp_cashback_rede',
        routingKey: 'cashback-rede',
        data: expect.objectContaining({
          phone: '5511999990001',
          consumerName: 'Nível 1',
          cashbackValor: '2.00',
          origemName: 'Loja Teste',
          redeNome: 'Nível 0',
        }),
      }),
    );

    // Rede nível 2
    expect(produceService.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        exchange: 'whatsapp',
        queue: 'whatsapp_cashback_rede',
        routingKey: 'cashback-rede',
        data: expect.objectContaining({
          phone: '5511999990002',
          consumerName: 'Nível 2',
          cashbackValor: '1.00',
          origemName: 'Loja Teste',
          redeNome: 'Nível 0',
        }),
      }),
    );
  });

  it('should skip nivel 1 transaction if consumer has no referred_by', async () => {
    payableRepo.findById.mockResolvedValue(mockPayable);
    mockConsumerRepo.findById.mockResolvedValue({ ...mockConsumer, referred_by: null, referred_by_level2: null });
    ratesRepo.findActive.mockResolvedValue(mockRates);

    txRepo.create.mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel0-uuid', amount: 5.0 }));

    const result = await useCase.execute({ payable_id: 'payable-uuid' });

    expect(result.transactions).toHaveLength(1);
    expect(produceService.publish).toHaveBeenCalledTimes(1); // apenas compra
  });

  it('should not publish if phone is missing for a consumer', async () => {
    // Remove phone do nível 1
    const partialPhoneMap = new Map(mockPhoneMap);
    partialPhoneMap.delete('consumer-nivel1-uuid');
    mockPublicConsumerRepo.findPhonesByIds.mockResolvedValue(partialPhoneMap);

    payableRepo.findById.mockResolvedValue(mockPayable);
    setupConsumerRepoForThreeLevels();
    ratesRepo.findActive.mockResolvedValue(mockRates);

    txRepo.create
      .mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel0-uuid', amount: 5.0 }))
      .mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel1-uuid', amount: 2.0, type: 'referral_cashback', description: 'CashBack Compras Indicado' }))
      .mockResolvedValueOnce(makeTx({ consumer_id: 'consumer-nivel2-uuid', amount: 1.0, type: 'referral_cashback', description: 'CashBack Compras Indicado' }));

    await useCase.execute({ payable_id: 'payable-uuid' });

    // Deve publicar nível 0 e nível 2, pular nível 1 (sem phone)
    expect(produceService.publish).toHaveBeenCalledTimes(2);
  });

  // ─── Idempotência ───────────────────────────────────────────────────────────

  it('should not create new transactions when the payable was already distributed', async () => {
    const existing = [
      makeTx({ id: 'tx-0', consumer_id: 'consumer-nivel0-uuid', amount: 5.0 }),
      makeTx({ id: 'tx-1', consumer_id: 'consumer-nivel1-uuid', amount: 2.0, type: 'referral_cashback' }),
    ];

    payableRepo.findById.mockResolvedValue(mockPayable);
    txRepo.findDistributedByPayableId.mockResolvedValue(existing);

    const result = await useCase.execute({ payable_id: 'payable-uuid' });

    expect(txRepo.create).not.toHaveBeenCalled();
    expect(produceService.publish).not.toHaveBeenCalled();
    expect(result.already_distributed).toBe(true);
    expect(result.transactions).toEqual(existing);
    expect(result.payable_id).toBe('payable-uuid');
    expect(result.order_value).toBe(100.0);
  });

  it('should not fetch consumer or rates when the payable was already distributed', async () => {
    payableRepo.findById.mockResolvedValue(mockPayable);
    txRepo.findDistributedByPayableId.mockResolvedValue([
      makeTx({ id: 'tx-0', consumer_id: 'consumer-nivel0-uuid', amount: 5.0 }),
    ]);

    await useCase.execute({ payable_id: 'payable-uuid' });

    expect(mockConsumerRepo.findById).not.toHaveBeenCalled();
    expect(ratesRepo.findActive).not.toHaveBeenCalled();
    expect(produceService.publish).not.toHaveBeenCalled();
  });

  it('should check idempotency using the payable id', async () => {
    payableRepo.findById.mockResolvedValue(mockPayable);
    mockConsumerRepo.findById.mockResolvedValue(mockConsumer);
    ratesRepo.findActive.mockResolvedValue(mockRates);
    txRepo.create.mockResolvedValue(makeTx({}));

    await useCase.execute({ payable_id: 'payable-uuid' });

    expect(txRepo.findDistributedByPayableId).toHaveBeenCalledWith('payable-uuid');
  });
});
