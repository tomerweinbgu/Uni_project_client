import { useEffect, useState } from "react";
import "./AmericanQuestion.css";


interface QuizData {
question: string;
answers: string[];
right_answer: number;
assistant_id: string;
thread_id: string;
file_name?: string;
}

  interface AmericanQuestionProps {
    quizData: QuizData | null;
    updateQuizData: (data: QuizData | null) => void;
    file_name: string;
  }
  


const AmericanQuestion: React.FC<AmericanQuestionProps> = ({quizData, updateQuizData, file_name}) => {
    const [error, setError] = useState<string>("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editableAnswer, setEditableAnswer] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editableQuestion, setEditableQuestion] = useState('');

    useEffect(() => {
        if (quizData) {
          setEditableQuestion(quizData.question);
        }
      }, [quizData]);
    
      const handleDoubleClick = () => {
        setIsEditing(true);
      };
    
      const handleChangeQuestion = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditableQuestion(event.target.value);
      };
    
      const handleBlur = () => {
        if (quizData) {
          updateQuizData({...quizData, question: editableQuestion});
        }
        setIsEditing(false);
      };
    
      const handleAnswerDoubleClick = (index: number) => {
        setEditingIndex(index);
        setEditableAnswer(quizData ? quizData.answers[index] : '');
      };
    
      const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditableAnswer(event.target.value);
      };
    
      const handleAnswerBlur = () => {
        if (quizData && editingIndex !== null) {
          const updatedAnswers = [...quizData.answers];
          updatedAnswers[editingIndex] = editableAnswer;
          updateQuizData({...quizData, answers: updatedAnswers});
          setEditingIndex(null);
        }
      };
    

    
    
      const handleSaveQuestion = async () => {
        
        if (quizData) {
          if (file_name) quizData.file_name = file_name 

          try {
            const response = await fetch('http://127.0.0.1:8000/add_question_to_quiz', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(quizData)
            });
    
          console.log('Question fetched successfully:');
        } catch (error) {
          console.error('Failed to fetch question:', error);
          setError('Failed to fetch question');
          updateQuizData(null);
        }
      }
    };

    
    return (
        <div className="questionContainer">
            <h3 className="title"> Question: </h3>
            <textarea 
                className="questionArea" 
                value={isEditing ? editableQuestion : (quizData ? quizData.question : '')}
                onChange={handleChangeQuestion}
                onDoubleClick={handleDoubleClick}
                onBlur={handleBlur}
                readOnly={!isEditing}
            />

            <ul className="optionsContainer">
            {quizData && quizData.answers ? (
                quizData.answers.map((answer, index) => (
                editingIndex === index ? (
                    <input
                    key={index}
                    value={editableAnswer}
                    onChange={handleAnswerChange}
                    onBlur={handleAnswerBlur}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                        handleAnswerBlur(); // Triggers the blur function on Enter key press
                        }
                    }}
                    autoFocus
                    />
                ) : (
                    <li key={index} className="optionItem" onDoubleClick={() => handleAnswerDoubleClick(index)}>
                    {answer}
                    </li>
                )
                ))
            ) : (
                <li className="optionItem">No options available</li>
            )}
            </ul>

            <div className="SaveQuestionContainer">
                <button className="saveButton" onClick={handleSaveQuestion}> Save question</button>
                <div>
                    <h3 className={`correctAnswerText ${quizData && quizData.answers && quizData.answers.length > quizData.right_answer ? 'visible' : 'hidden'}`}>
                    Correct Answer
                    </h3>
                    <span className="correctAnswer">
                    {quizData && quizData.answers && quizData.answers.length > quizData.right_answer ? quizData.answers[quizData.right_answer] : ''}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default AmericanQuestion;