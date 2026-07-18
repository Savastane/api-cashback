import { Injectable } from '@nestjs/common';
import {
  PayloadModel,

} from '../model/payload.model';

@Injectable()
export class PayloadService {
  private payload: PayloadModel;

  constructor() {
    this.resetPayload();
  }

  getPayload(): PayloadModel {
    return this.payload;
  }

  resetPayload(): void {
    this.payload = {
      id: '',
      exchange: '',
      queue: '',
      data: {},
      timestamp: '',
      routingKey: '',
    };
  }

  loadEnvelope(envelope: Pick<PayloadModel, 'id' | 'exchange' | 'queue' | 'timestamp' | 'routingKey'>): void {
    this.payload = {
      ...this.payload,
      ...envelope,
    };
  }

}