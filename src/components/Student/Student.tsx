import React, { useState, useEffect } from "react";
import "./Student.css";
import { useNavigate } from "react-router-dom";
import hljs from "highlight.js";
import "highlight.js/styles/base16/atelier-dune-light.min.css";

// interface AnswerObject {
//     contentType: string;
//     answer: string;
//   }

interface AnswerPartObject {
    type: string;
    content: string;
  }

interface AnswerObject {
    content: string;
    thread_id: string;
    assistant_id: string;
  }

const StaffQuestionGeneration: React.FC = () => {
const navigate = useNavigate();
  const [answer, setAnswer] = useState<AnswerObject | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [questionLoading, setQuestionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fileId, setFileId] = useState<string>("");
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [segments, setSegments] = useState<AnswerPartObject[]>([]);


  useEffect(() => {
    if (!answer) {
      return;
    }
    const parts = answer.content.split(/(`.*?`)/g); // Split the answer by code marked with backticks
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
        // It's regular text
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
    formData.append('file_id', fileId);
    formData.append('question', textareaValue);

    try {
      const response = await fetch('http://127.0.0.1:8000/ask_question', {
        method: 'POST',
        body: formData,
      });;

      const data: AnswerObject = await response.json();
      console.log(data);
      console.log("hey");
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const goBackToLobby = () => {
    navigate("/"); 
  };

  const highlightedHtml = hljs.highlightAuto(answer?.content? answer.content : "").value;
  console.log("check");
  console.log(highlightedHtml);

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }
    setUploadLoading(true);
    setError("");
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload_file', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setFileId(result);
      console.log('File uploaded successfully:', result);
      setFileUploaded(true);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file');
    } finally {
    setUploadLoading(false);
    }
  };

  return (
    <div className="quizContainer">
      <input type="file" className="fileInput" onChange={handleFileChange} accept=".md" />
      <br />
      <br />
      <div className="questionUploadContainer">
        {fileUploaded ? <button onClick={uploadFile} className="uploadButton">Change File</button> : 
        <button onClick={uploadFile} className="quizButton">Upload File</button>}

      </div>
        
        {fileUploaded &&
        <div className="title-text">
      <h3 className="title"> Question: </h3>
  <textarea 
    className="studentQuestionArea" 
    value={textareaValue}
    onChange={(e) => setTextareaValue(e.target.value)}
  />

<button onClick={fetchQuestion} className="quizButton">Ask a Question</button>    
</div>
        }

  {uploadLoading && <p>Loading...</p>}
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

<button onClick={goBackToLobby} className="backbutton">Back to Lobby</button>
    </div>
  );
};

export default StaffQuestionGeneration;
