import React, { useState, useEffect } from "react";
import "./StudentBox.css";
import { useNavigate } from "react-router-dom";

import hljs from "highlight.js";
import "highlight.js/styles/base16/atelier-dune-light.min.css";

import { APP_API_URL, LOAD_QUIZ_NAMES_API, ASK_QUESTION_API} from '../../common/consts/ApiPaths';
import { AnswerPartObject, AnswerObject} from './../../common/interfaces/AskQuestion'

interface StudentBoxProps {
    fileId: string | Blob;
  }


const StudentBox: React.FC<StudentBoxProps> = ({fileId}) => {
const navigate = useNavigate();
  const [answer, setAnswer] = useState<AnswerObject | null>(null);
  const [questionLoading, setQuestionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [segments, setSegments] = useState<AnswerPartObject[]>([]);
//   const [assistantId, setAssistantId] = useState<string>("");
//   const [threadId, setThreadId] = useState<string>("");
  const [fileNames, setFileNames] = useState<string[]>([]);



  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${APP_API_URL}/${LOAD_QUIZ_NAMES_API}`);
        const fetchedFileNames = await response.json();
        setFileNames(fetchedFileNames);

      } catch (error) {
        console.error('Failed to fetch files:', error);
      }
    };
  
    fetchFiles();
  }, []);

  useEffect(() => {
    if (!answer) {
      return;
    }
    const parts = answer.content.split(/(`.*?`)/g);
    const processedParts = parts.map(part => {
      if (part.startsWith('```typescript') && part.endsWith('```')) {
        return {
          type: 'code',
          content: hljs.highlightAuto(part.slice(13, -3)).value
        } as AnswerPartObject;
      }
      else if (part.startsWith('`typescript') && part.endsWith('`')) {
        return {
          type: 'code',
          content: hljs.highlightAuto(part.slice(11, -1)).value
        } as AnswerPartObject;
      }

      else if (part.startsWith('`') && part.endsWith('`')) {
        return {
          type: 'code',
          content: hljs.highlightAuto(part.slice(1, -1)).value
        } as AnswerPartObject;
      } else {
        return {
          type: 'text',
          content: part
        } as AnswerPartObject;
      }
    });
    
    setSegments(processedParts);
    console.log(processedParts)
  }, [answer]);


  const fetchQuestion = async () => {
    setQuestionLoading(true);
    setError("");
    
    const formData = new FormData();
    
    console.log("fileId", fileId)
    formData.append('file_id', fileId);
    formData.append('question', textareaValue);
    // if (threadId) formData.append('thread_id', threadId);
    // if (assistantId) formData.append('assistant_id', assistantId);
    try {
        const response = await fetch(`${APP_API_URL}/${ASK_QUESTION_API}`, {
            method: 'POST',
            body: formData,
            });;
            
      const data: AnswerObject = await response.json();

      setAnswer(data);
      console.log('Question fetched successfully:', data);
      
     
    } catch (error) {
      console.error('Failed to fetch question:', error);
      setError('Failed to fetch question');
      setAnswer(null);
    } finally {
        setQuestionLoading(false);
    }
  };


  const goBackToLobby = () => {
    navigate("/"); 
  };

  const highlightedHtml = hljs.highlightAuto(answer?.content? answer.content : "").value;
  console.log(highlightedHtml);



  return (
    <div className="quizContainer">
        <div className="title-text">
            <h3 className="title"> Question: </h3>
            <textarea 
            className="studentQuestionArea" 
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            />
            <button onClick={fetchQuestion} className="studentUploadButton">Ask a Question</button>    
        </div>

        {questionLoading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

        <div>

        <div className="whiteSpaceContainer">
        {segments.map((segment, index) =>
            segment.type === 'code' ? (
            <code key={index} className="inlineCode" dangerouslySetInnerHTML={{ __html: segment.content }} />
            ) : (
            <span key={index} className="inlineText">{segment.content}</span>
            )
        )}
        </div>
    </div>

    <button onClick={goBackToLobby} className="studentBackbutton">Back to Lobby</button>
</div>

)};

export default StudentBox;
