export interface PayloadModel {
  
  exchange: string;
  queue: string;
  routingKey: string;
  data: any;
  timestamp: string;
  id: string;  
  exchangeType?: string;
}
