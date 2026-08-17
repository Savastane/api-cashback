/**
 * Modelo da tabela `public.consumer` (schema public).
 *
 * Representa o consumer autenticado no app RedeCity, com dados de contato,
 * gamificação (pontos, badges), segurança (2FA) e referência de indicação.
 *
 * Observação: a coluna `password` existe no banco mas é intencionalmente
 * omitida deste modelo por questões de segurança — ela nunca deve ser lida
 * pela aplicação de cashback.
 */
export interface ConsumerModel {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: Date;
  updated_at: Date;
  phone_verified: boolean | null;
  is_2fa_enabled: boolean | null;
  preferred_2fa_method: string | null;
  userid: string | null;
  provider_type: string | null;
  total_orders: number | null;
  total_reviews: number | null;
  total_points: number | null;
  saved_amount: number | null;
  document: string | null;
  billing_full_name: string | null;
  whatsapp_number: string | null;
  sms_number: string | null;
  external_id: string | null;
  nickname: string | null;
  referral_id: string | null;
}
