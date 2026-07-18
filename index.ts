import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Controller('customers1')
export class CustomersController {
  // URL base da API Asaas Sandbox
  private readonly asaasApiUrl = 'https://api-sandbox.asaas.com/v3/customers';

  // Endpoint para criar um cliente na API do Asaas
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(
    @Body() customerData: {
      name: string;
      email: string;
      phone: string;
      address: string;
      addressNumber: string;
      province: string;
      postalCode: string;
      cpfCnpj: string;
      mobilePhone: string;
      externalReference: string;
      notificationDisabled: boolean;
      observations: string;
      groupName: string;
    },
  ) {
    try {
      const response = await axios.post(this.asaasApiUrl, customerData, {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          access_token: '456456456456', // Substitua pelo seu token de acesso real
        },
      });

      // Retornar a resposta da API do Asaas
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Erro ao criar cliente no Asaas:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.errors || 'Erro desconhecido',
      };
    }
  }
}