import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environmets';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageApi = environment.messageApiService;

  constructor(private http: HttpClient) {}

  sendMessage(nome: string, msg: string, phone: string) {
    return this.http.post(this.messageApi, {
      number: 'whatsapp:+55' + phone,
      message: `Olá ${nome}. Há novo teste a ser realizado no App Vital Quiz.\nVisite o site ${msg} e faça sua avaliação.`,
    });
  }
}
