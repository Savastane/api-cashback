export type ReferralStatus = 'pending' | 'active';

export interface CashbackConsumer {
  id: string;
  referral_code: string;
  referred_by: string | null;
  referred_by_level2: string | null;
  username: string;
  full_name: string | null;
  referral_status: ReferralStatus;
  cashback_balance: number;
  created_at: Date;
  updated_at: Date;
}
