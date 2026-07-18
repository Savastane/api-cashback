
 create table cashback_rates (
  id           uuid primary key default gen_random_uuid(),  
  percentage_0   numeric(5,2) not null check (percentage_0 >= 0 and percentage_0 <= 100), -- percentual aplicado
  percentage_1   numeric(5,2) not null check (percentage_1 >= 0 and percentage_1 <= 100), -- percentual aplicado
  percentage_2   numeric(5,2) not null check (percentage_2 >= 0 and percentage_2 <= 100), -- percentual aplicado  
  active       boolean not null default true,                 -- se esta taxa está em uso
  created_at   timestamptz not null default now()
);