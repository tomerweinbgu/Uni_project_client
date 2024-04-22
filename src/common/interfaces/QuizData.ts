// src/common/interfaces/QuizData.ts

export interface QuizData {
    question: string;
    answers: string[];
    right_answer: number;
    assistant_id: string;
    thread_id: string;
    file_name?: string;
}

export interface AmericanQuestionProps {
    quizData: QuizData | null;
    updateQuizData: (data: QuizData | null) => void;
    file_name?: string;
}
