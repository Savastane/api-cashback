-- Migration: Adicionar 'balancemonth' ao check constraint de cashback.transaction.type
-- Executar no Supabase SQL Editor: https://supabase.com/dashboard/project/tpkrqseeyplevbuhqasf/sql

-- 1. Remove o constraint antigo
ALTER TABLE cashback.transaction
  DROP CONSTRAINT IF EXISTS transaction_type_check;

-- 2. Recria o constraint incluindo 'balancemonth'
ALTER TABLE cashback.transaction
  ADD CONSTRAINT transaction_type_check
    CHECK (type IN ('purchase_cashback', 'referral_cashback', 'redemption', 'adjustment', 'balancemonth'));
