import React, { useState } from "react";
import "./Student.css";
import { useNavigate } from "react-router-dom";
import hljs from "highlight.js";
import "highlight.js/styles/base16/atelier-dune-light.min.css";

interface AnswerObject {
    contentType: string;
    answer: string;
  }

const StaffQuestionGeneration: React.FC = () => {
const navigate = useNavigate();
  const [answersData, setAnswersData] = useState<AnswerObject[] | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [questionLoading, setQuestionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fileId, setFileId] = useState<string>("");
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);



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

      const data: AnswerObject[] = await response.json();
      console.log(data);
      console.log("hey");
    //   console.log(data[0].answer);
      setAnswersData(data);
      if (data.length > 0){
        const formattedText = data[0].answer.split("\n").map(line => `({ contentType: 'text', answer: '${line}' })`).join(", ");

        setAnswer(formattedText);
      }
      console.log('Question fetched successfully:', data);
    } catch (error) {
      console.error('Failed to fetch question:', error);
      setError('Failed to fetch question');
      setAnswersData(null);
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

  const highlightedHtml = hljs.highlightAuto(answersData && answersData.length > 0 ? answersData[0].answer: "").value;
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
        <button onClick={uploadFile} className="quizButton">Upload File</button>
        
        {fileUploaded &&
        <div className="title-text">
      <h3 className="title"> Question: </h3>
  <textarea 
    className="studentQuestionArea" 
    value={textareaValue}
    onChange={(e) => setTextareaValue(e.target.value)}
  />
  

  {uploadLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

<div>
      <button onClick={fetchQuestion} className="quizButton">Ask a Question</button>
      </div>
  </div>
}




    {highlightedHtml &&
    <div className="title-text">
    <h3 className="title"> Answer: </h3>
    <pre className="answerArea">
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
    </pre>
    </div>
}

{/* <textarea 
    className="answerArea" 
    value={answersData && answersData.length > 0 ? answersData[0].answer : ''}  
    readOnly
  /> */}

</div>

<button onClick={goBackToLobby} className="backbutton">Back to Lobby</button>
    </div>
  );
};

export default StaffQuestionGeneration;
