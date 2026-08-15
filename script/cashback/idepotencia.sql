-- =============================================================================
-- Migration: Idempotência de Distribuição e Atualização Automática de Saldo
-- =============================================================================

-- 1. Constraint de Idempotência: Garante que um payable não gera mais de uma
--    transação do mesmo tipo para o mesmo consumidor
CREATE UNIQUE INDEX IF NOT EXISTS uq_cashback_tx_payable_consumer_type 
ON cashback.transaction (payable_id, consumer_id, type)
WHERE payable_id IS NOT NULL;

-- 2. Função Trigger para atualização atômica de saldo no consumer
CREATE OR REPLACE FUNCTION cashback.fn_update_consumer_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.direction = 'in') THEN
      UPDATE cashback.consumer
      SET cashback_balance = cashback_balance + NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.consumer_id;
    ELSIF (NEW.direction = 'out') THEN
      UPDATE cashback.consumer
      SET cashback_balance = cashback_balance - NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.consumer_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger vinculada à tabela de transações
DROP TRIGGER IF EXISTS trg_update_cashback_balance ON cashback.transaction;
CREATE TRIGGER trg_update_cashback_balance
AFTER INSERT ON cashback.transaction
FOR EACH ROW
EXECUTE FUNCTION cashback.fn_update_consumer_balance();
