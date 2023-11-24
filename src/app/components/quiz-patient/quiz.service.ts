import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuizService {
  questionsList = [
    'Categoria I : Ansiedade psíquica : Humor ansioso (Preocupações, previsão do pior, antecipação temerosa, irritabilidade..)',
    'Categoria I : Ansiedade psíquica : Tensão (Sensações de tensão, fadiga, reação de sobressalto, comove-se facilmente, tremores, incapacidade para relaxar e agitação)',
    'Categoria I : Ansiedade psíquica : Medos (De escuro, de estranhos, de ficar sozinho, de animais, de trânsito, de multidões,etc)',
    'Categoria I : Ansiedade psíquica : Insônia (Dificuldade em adormecer, sono interrompido, insatisfeito e fadiga ao despertar, pesadelos, terrores nocturnos...)',
    'Categoria I : Ansiedade psíquica : Dificuldades intelectuais (Dificuldade deconcentração, falhas de memória, etc)',
    'Categoria I : Ansiedade psíquica : Humor depressivo (Perda de interesse, falta de prazer nos passatempos, depressão, despertar  precoce, oscilação do humor...)',
    'Categoria II : Ansiedade Somática : Sintomas musculares (Dores musculares, rigidez muscular, contracções espásticas, contracções involuntárias, etc)',
    'Categoria II : Ansiedade Somática : Sintomas sensoriais (Ondas de frio ou calor,sensações de fraqueza, visão turva, sensação de picadas, formigueiro, cãibras, dormências, zumbidos, etc)',
    'Categoria II : Ansiedade Somática : Sintomas cardiovasculares (Taquicardia, palpitações, dores toráxicas, sensação de desmaio, vertigem, etc)',
    'Categoria II : Ansiedade Somática : Sintomas respiratórios (Sensações de opressão ou constrição no tórax, sensações de sufocamento ou asfixia, suspiros...)',
    'Categoria II : Ansiedade Somática : Sintomas genito-urinários (Urgência miccional, amenorreia, menorragia, erecção incompleta, ejaculação precoce, impotência,diminuição da libido, etc)',
    'Categoria II : Ansiedade Somática : Sintomas do sistema nervoso autónomo (Boca seca, rubor, palidez, tendência a sudorese, mãos molhadas, inquietação, tensão, dor de cabeça, pêlos eriçados, tonturas, etc)',
  ];

  answersList = [
    { id: 0, text: 'Ausente', emoji: '😄' },
    { id: 1, text: 'Leve', emoji: '😊' },
    { id: 2, text: 'Moderada', emoji: '😐' },
    { id: 3, text: 'Frequente', emoji: '😔' },
    { id: 4, text: 'Muito frequente', emoji: '😩' },
  ];

  getQuestions() {
    return this.questionsList.slice();
  }

  getAnswers() {
    return this.answersList.slice();
  }
}
