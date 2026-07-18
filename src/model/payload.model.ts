export interface PayloadModel {
  id: string;
  exchange: string;
  queue: string;
  data: any;
  timestamp: string;
  routingKey: string;
}
