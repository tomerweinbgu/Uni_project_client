import { useEffect, useRef, useState } from "react";
import "./AmericanQuestion.css";
import { AmericanQuestionProps} from './../../common/interfaces/QuizData';
import { APP_API_URL, ADD_QUESTIONS_TO_QUIZ_API } from '../../common/consts/ApiPaths';
import { QuizDataFactory } from "../../common/interfaces/QuizData";







const AmericanQuestion: React.FC<AmericanQuestionProps> = ({quizData, updateQuizData, file_name}) => {
    const [error, setError] = useState<string>("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editableAnswer, setEditableAnswer] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const [isEditing, setIsEditing] = useState(false);
    const [editableQuestion, setEditableQuestion] = useState('');
    const [showSavedText, setShowSavedText] = useState<string>("");


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
    
      const handleAnswerChange = (e: any) => {
        setEditableAnswer(e.target.value);
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
          const quizDataWithId = QuizDataFactory.createQuizData(quizData);

          try {
            const response = await fetch(`${APP_API_URL}/${ADD_QUESTIONS_TO_QUIZ_API}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              // body: JSON.stringify(quizData)
              body: JSON.stringify(quizDataWithId)
            });

          setShowSavedText("Saved")
          setTimeout(() => {
            setShowSavedText("");
        }, 3000); 
    
          console.log('Question fetched successfully:');
        } catch (error) {
          console.error('Failed to fetch question:', error);
          setError('Failed to fetch question');
          updateQuizData(null);
        }
      }
    };

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        textareaRef.current.style.minWidth = '400px';
        textareaRef.current.style.maxWidth = '800px';
        textareaRef.current.style.fontSize = '16px';
      }
    }, [editableAnswer]);

    
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
                  <textarea
                  className="editableAnswerInput"
                  key={index}
                  value={editableAnswer}
                  onChange={handleAnswerChange}
                  onBlur={handleAnswerBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleAnswerBlur();
                    }
                  }}
                  autoFocus
                  ref={textareaRef}
                  rows={1}
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
              <div className="saveContainerStaff">
                <button className="saveButtonStaff" onClick={handleSaveQuestion}> Save question</button>
                {showSavedText === "Saved" && <p className="saveText">File saved successfully!</p>}
              </div>

              <div>
                  <h3 className={`correctAnswerText ${quizData && quizData.answers && quizData.answers.length >= quizData.right_answer ? 'visible' : 'hidden'}`}>
                  Correct Answer
                  </h3>
                  <span className="correctAnswer">
                  {quizData && quizData.answers && quizData.answers.length >= quizData.right_answer ? quizData.right_answer : ''}
                  </span>
              </div>
            </div>
        </div>
    )
}

export default AmericanQuestion;