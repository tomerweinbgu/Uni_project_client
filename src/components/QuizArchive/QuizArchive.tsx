import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./QuizArchive.css";

interface QuizData {
    question: string;
    answers: string[];
    right_answer: number;
}

interface AnswerStatus {
  selectedAnswer: number | null;
  isSubmitted: boolean;
}

const QuizPage: React.FC = () => {
    const navigate = useNavigate();
    const { quizName, questionNumber } = useParams<{quizName: string, questionNumber: string}>();
    const [quizData, setQuizData] = useState<QuizData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [answerStatus, setAnswerStatus] = useState<AnswerStatus>({ selectedAnswer: null, isSubmitted: false });


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

    const handleAnswerClick = (index: number) => {
      if (!answerStatus.isSubmitted) {
          setAnswerStatus({ selectedAnswer: index, isSubmitted: true });
      }
  };


    const currentQuestionIndex = parseInt(questionNumber || "1", 10) - 1;
    const question = quizData[currentQuestionIndex];

    if (!question) return <div>No question found</div>;

    const handleNavigation = (offset: number) => {
        const nextQuestionNumber = currentQuestionIndex + offset + 1;
        if (nextQuestionNumber > 0 && nextQuestionNumber <= quizData.length) {
            navigate(`/quiz/${quizName}/${nextQuestionNumber}`);
        }
    };

    const goBackToLobby = () => {
        navigate("/staff");
    };

    return (
        <div className="specificQuizContainer">
            <textarea 
                className="questionArea" 
                value={question.question} 
                readOnly 
            />
            <ul className="optionsContainer">
                {question.answers.map((answer, index) => (
                    <li key={index}
                        className={"optionItem"}
                        onClick={() => handleAnswerClick(index)}>
                        {answer} 
                    </li>
                ))}
            </ul>

            <div className="navigationButtons">
                <button className={"prevOrNextButton"} onClick={() => handleNavigation(-1)} disabled={currentQuestionIndex <= 0}>Previous</button>
                <button className={"prevOrNextButton"} onClick={() => handleNavigation(1)} disabled={currentQuestionIndex >= quizData.length - 1}>Next</button>
            </div>

            <button onClick={goBackToLobby} className="backbutton">Back to Lobby</button>
        </div>
    );
};

export default QuizPage;
