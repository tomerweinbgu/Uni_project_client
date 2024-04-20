import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const QuizPage: React.FC = () => {
  interface QuizData {
    question: string;
    answers: string[];
    right_answer: number;
  }

  const { quizId, questionNumber } = useParams<{ quizId: string, questionNumber: string }>();
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  useEffect(() => {
    // Fetch the quiz data from the server or local state
    // This is a placeholder. You'll need to implement the actual fetch logic based on your backend API.
    const fetchQuestion = async () => {
      const response = await fetch(`/api/quizzes/${quizId}/questions/${questionNumber}`);
      const data = await response.json();
      setQuizData(data);
    };

    fetchQuestion();
  }, [quizId, questionNumber]);

  return (
    <div>
      <textarea 
        className="questionArea" 
        value={quizData ? quizData.question : ''} 
        readOnly
      />
      <ul className="optionsContainer">
        {quizData && quizData.answers.map((answer, index) => (
          <li key={index} className="optionItem">{answer}</li>
        ))}
      </ul>
      <div>
        <h3 className={`correctAnswerText ${quizData && quizData.right_answer !== undefined ? 'visible' : 'hidden'}`}>
          Correct Answer
        </h3>
        <span className="correctAnswer">
          {quizData ? quizData.answers[quizData.right_answer] : ''}
        </span>
      </div>
    </div>
  );
}

export default QuizPage;
