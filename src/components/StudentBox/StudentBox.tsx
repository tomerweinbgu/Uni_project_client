import React, { useState, useEffect } from "react";
import "./StudentBox.css";
import { useNavigate } from "react-router-dom";

import hljs from "highlight.js";
import "highlight.js/styles/base16/atelier-dune-light.min.css";

import { APP_API_URL, LOAD_QUIZ_NAMES_API, ASK_QUESTION_API} from '../../common/consts/ApiPaths';
import { AnswerPartObject, AnswerObject} from './../../common/interfaces/AskQuestion'

interface StudentBoxProps {
    fileId: string | null;
  }

enum TypesOfRegex {
  CodeBlock = "`[^`]*`",
  UploadedFileAnswer = "Based on the content of the uploaded file:",
  ChatGPTAnswer = "Based on the chatGPT engine:",
  // NumberedStep = "\\b[0-9]+\\."
  NumberedStep = "/b(3/.|4/.)"

  // NumberedStep = "^\d+\.$"
}

enum TypeOfContent {
  Code = "code",
  Text = "text",
  Bold = "bold",
  NumberedStep = "numberedStep",
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
    // const parts = answer.content.split(/(`.*?`)/g);
    // const parts = answer.content.split(/(`[^`]*`)/g);

    console.log("1.".match(new RegExp(TypesOfRegex.NumberedStep)))
    console.log("2.".match(TypesOfRegex.NumberedStep))
    console.log(" 3. ".match(new RegExp(TypesOfRegex.NumberedStep)))
    console.log(" 3. ".match(new RegExp(TypesOfRegex.NumberedStep)))
    
    const regexPattern = new RegExp(
      `(${TypesOfRegex.CodeBlock}|${TypesOfRegex.UploadedFileAnswer}
      |${TypesOfRegex.ChatGPTAnswer}|${TypesOfRegex.NumberedStep} )`,
      "g"
    );
    const parts = answer.content.split(regexPattern);


    console.log("parts")
    console.log(parts)
    const processedParts = parts.map(part => {
      if (part === undefined) {
        return {
          type: TypeOfContent.Text,
          content:""
        } as AnswerPartObject; 
      }
    // else if (part.match(new RegExp(TypesOfRegex.NumberedStep))) {
    //   return {
    //       type: TypeOfContent.NumberedStep,
    //       content: part
    //     } as AnswerPartObject;
    //   }
      else if (part === TypesOfRegex.UploadedFileAnswer || part === TypesOfRegex.ChatGPTAnswer){
        return {
          type: TypeOfContent.Bold,
          content: part
        } as AnswerPartObject;
      }
      else if (part.startsWith('```typescript') && part.endsWith('```')) {
        return {
          type: TypeOfContent.Code,
          content: hljs.highlightAuto(part.slice(13, -3)).value
        } as AnswerPartObject;
      }
      else if (part.startsWith('`typescript') && part.endsWith('`')) {
        return {
          type: TypeOfContent.Code,
          content: hljs.highlightAuto(part.slice(11, -1)).value
        } as AnswerPartObject;
      }
      else if (part.startsWith('`') && part.endsWith('`')) {
        return {
          type: TypeOfContent.Code,
          content: hljs.highlightAuto(part.slice(1, -1)).value
        } as AnswerPartObject;
      }
      else if (part.startsWith('`') && part.endsWith('`')) {
        return {
          type: TypeOfContent.Code,
          content: hljs.highlightAuto(part.slice(1, -1)).value
        } as AnswerPartObject;
      }
       else {
        return {
          type: TypeOfContent.Text,
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
    formData.append('question', textareaValue);
    fileId ? formData.append('file_id', fileId) : console.log("no file id");
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
            {fileId ? 
            <button onClick={fetchQuestion} className="studentAskQuestionButton" disabled={false}>Ask a Question</button> :
            <div>
              <button onClick={fetchQuestion} className="studentAskQuestionButton" disabled={true}>Ask a Question</button>     
              <p className="chooseFile">Choose a file for asking a question</p>
            </div>

            }
        </div>

        {questionLoading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

        <div>

        <div className="whiteSpaceContainer">
        {segments.map((segment, index) =>
            segment.type === TypeOfContent.Code ? 
            (<code key={index} className="inlineCode" dangerouslySetInnerHTML={{ __html: segment.content }} />) :
            segment.type === TypeOfContent.Bold ? 
            (<><span key={index} className="boldText">{segment.content}</span> <br /></>) :
            segment.type === TypeOfContent.NumberedStep ? 
            ((<><br /><span key={index} className="numberedStep">{segment.content}</span> </>)) :
            (<span key={index} className="inlineText">{segment.content}</span>)
        )}
        </div>
    </div>

    <button onClick={goBackToLobby} className="studentBackbutton">Back to Lobby</button>
</div>

)};

export default StudentBox;
