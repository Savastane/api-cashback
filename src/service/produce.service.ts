import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PayloadModel } from '../model/payload.model';

@Injectable()
export class ProduceService {
  private readonly url: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const rawUrl = this.configService.get<string>('PRODUCE_API_URL') || 'https://produce.redecity.com.br';
    const baseUrl = rawUrl.replace(/\/publish\/?$/, '').replace(/\/+$/, '');
    this.url = `${baseUrl}/publish`;
  }

  async publish(message: PayloadModel): Promise<AxiosResponse> {
    return firstValueFrom(this.httpService.post(this.url, message));
  }
}
