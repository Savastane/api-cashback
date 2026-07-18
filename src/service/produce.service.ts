import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PayloadModel } from '../model/payload.model';

@Injectable()
export class ProduceService {
  private readonly url = 'https://produce.redecity.com.br/publish';

  constructor(private readonly httpService: HttpService) {}

  async publish(message: PayloadModel): Promise<AxiosResponse> {
    return firstValueFrom(this.httpService.post(this.url, message));
  }
}
