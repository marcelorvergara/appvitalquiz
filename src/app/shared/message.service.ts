import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environmets';
import { ReturnedFromMessageSent } from './models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageApi = environment.messageApiService;

  constructor(private http: HttpClient) {}

  sendMessage(nome: string, msg: string, phone: string) {
    return this.http.post<ReturnedFromMessageSent>(this.messageApi, {
      number: 'whatsapp:+55' + phone,
      message: `Olá ${nome},\nHá uma nova avaliação disponível.\nVisite o site ${msg} e faça sua avaliação.`,
    });
  }
}
