import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./QuizArchive.css";


interface QuizData {
    question: string;
    answers: string[];
    right_answer: number;
}

const QuizPage: React.FC = () => {
    const { quizName, questionNumber } = useParams<{quizName: string, questionNumber: string}>();
    const [quizData, setQuizData] = useState<QuizData[]>([]);
    const [loading, setLoading] = useState(true);
    // const [questionNumber, setQuestionNumber] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAmericanQuestions = async () => {
            if (!quizName) return;
            setLoading(true);
            const formData = new FormData();
            formData.append('file_name', quizName);

            try {
                const response = await fetch('http://127.0.0.1:8000/load_specific_quiz', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data: QuizData[] = await response.json();
                setQuizData(data);
            } catch (err: any) {
                setError('Failed to fetch questions: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAmericanQuestions();
    }, [quizName]); 

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const currentQuestionIndex = parseInt(questionNumber || "1", 10) - 1;
    const question = quizData[currentQuestionIndex]; // Selects the question based on the index

    if (!question) return <div>No question found</div>;

    return (
      <div className="specificQuizContainer">

            <textarea 
                className="questionArea" 
                value={question.question} 
                readOnly 
            />
            <ul className="optionsContainer">
                {question.answers.map((answer, index) => (
                    <li key={index} className="optionItem">{answer}</li>
                ))}
            </ul>
        </div>
    );
};

export default QuizPage;
