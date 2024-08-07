import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { APP_API_URL, DELETE_QUESTION_FROM_ARCHIVE, LOAD_SPECIFIC_QUIZ_API } from '../../common/consts/ApiPaths';

import "./QuizArchive.css";

interface QuizData {
    id: number;
    question: string;
    answers: string[];
    right_answer: number;
    chosen_answer: number | null;
}


const QuizPage: React.FC = () => {
    const navigate = useNavigate();
    const { typeOfUser, quizName, questionNumber } = useParams<{typeOfUser: string, quizName: string, questionNumber: string}>();
    const [quizDataDic, setQuizDataDic] = useState<QuizData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [answerClicked, setAnswerClicked] = useState<number | null>(null);
    const [shouldShowDeletedText, setShouldShowDeletedText] = useState<boolean>(false);



    useEffect(() => {
        const fetchAmericanQuestions = async () => {
            if (!quizName) return;
            setLoading(true);
            const formData = new FormData();
            formData.append('file_name', quizName);

            try {
                const response = await fetch(`${APP_API_URL}/${LOAD_SPECIFIC_QUIZ_API}`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data: QuizData[] = await response.json();
                setQuizDataDic(data);
                console.log(data, "data")
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

    const handleAnswerClick = (index: number, quizData: QuizData) => {
        console.log(index, "index")
        setAnswerClicked(index+1);
        quizData.chosen_answer = index+1;
    }

    const handleDeleteQuestion = async (quizId: number) => {
        const formData = new FormData();
        formData.append('quiz_id', quizId.toString());
        formData.append('file_name', quizName?.toString() || "");

        try {
            const response = await fetch(`${APP_API_URL}/${DELETE_QUESTION_FROM_ARCHIVE}`, {
                method: 'DELETE',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            showDeletedText();

            console.log(`${quizId} deleted successfully`)
        } catch (err: any) {
            setError('Failed to fetch questions: ' + err.message);
        }
    }

    const showDeletedText = () => {
        setShouldShowDeletedText(true)
        setTimeout(() => {
          setShouldShowDeletedText(false);
      }, 3000); 
    };


    const currentQuestionIndex = parseInt(questionNumber || "1", 10) - 1;
    const question = quizDataDic[currentQuestionIndex];

    if (!question) return <div>No question found</div>;

    const handleNavigation = (offset: number) => {
        const nextQuestionNumber = currentQuestionIndex + offset + 1;
        if (nextQuestionNumber > 0 && nextQuestionNumber <= quizDataDic.length) {
            navigate(`/quiz/${typeOfUser}/${quizName}/${nextQuestionNumber}`);
        }
        
        setAnswerClicked(null);
        

    };

    const formatQuizName = (name: string) => {
        return name.replace(/_/g, ' ')
                   .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const handleBackToLobby = () => {
        navigate(`/${typeOfUser}`);
    };

    return (
        <div className="quizOverviewContainer">
            <div className="specificQuizContainer">
                <h1 className="quiz_title"> {quizName ? formatQuizName(quizName) : quizName} </h1>
                <textarea 
                    className="questionArea" 
                    value={question.question} 
                    readOnly 
                />
                <ul className="optionsContainer">
                    {question.answers.map((answer, index) => (
                        <li key={index}
                            className={question.chosen_answer == index + 1 || answerClicked == index + 1  ?
                                (question.right_answer === index + 1 ? "rightAnswer" : "wrongAnswer")
                                : "optionItem" }
                            onClick={() => handleAnswerClick(index, question)}>
                            {answer} 
                        </li>
                    ))}
                </ul>

                <div className="navigationButtons">
                    <button className={"prevOrNextButton"} onClick={() => handleNavigation(-1)} disabled={currentQuestionIndex <= 0}>Previous</button>
                    <button className={"prevOrNextButton"} onClick={() => handleNavigation(1)} disabled={currentQuestionIndex >= quizDataDic.length - 1}>Next</button>
                </div>

                {typeOfUser === "staff" ?<button onClick={() => handleDeleteQuestion(question.id)} className="backbutton">Delete</button>: ""}
                {shouldShowDeletedText === true &&
                <p className="deletedText">
                    Question has deleted successfully from the db!
                </p>}


                <button onClick={handleBackToLobby} className="backbutton">Back to Lobby</button>
                
            </div>
        </div>
    );
};

export default QuizPage;
