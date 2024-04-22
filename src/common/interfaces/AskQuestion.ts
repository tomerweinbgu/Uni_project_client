// src/common/interfaces/AskQuestion.ts

export interface AnswerPartObject {
    type: string;
    content: string;
  }

export interface AnswerObject {
    content: string;
    thread_id: string;
    assistant_id: string;
  }