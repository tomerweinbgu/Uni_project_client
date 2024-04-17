import React, { useState } from "react";
import "./StaffQuestionGeneration.css";
import { useNavigate } from "react-router-dom";

interface QuizData {
  question: string;
  answers: string[];
  right_answer: number;
}

const StaffQuestionGeneration: React.FC = () => {
const navigate = useNavigate();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [questionGenerationLoading, setQuestionGenerationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fileId, setFileId] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);


  const fetchQuestion = async () => {
    setQuestionGenerationLoading(true);
    setError("");

    const formData = new FormData();
    formData.append('file_id', fileId);

    try {
      const response = await fetch('http://127.0.0.1:8000/generate_question', {
        method: 'POST',
        body: formData,
      });;

      const data: QuizData = await response.json();
      setQuizData(data);
      console.log('Question fetched successfully:', data);
    } catch (error) {
      console.error('Failed to fetch question:', error);
      setError('Failed to fetch question');
      setQuizData(null);
    } finally {
        setQuestionGenerationLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const goBackToLobby = () => {
    navigate("/"); 
  };

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

      </div>

      {uploadLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {fileUploaded &&
              <div className="title-text">
        <button onClick={fetchQuestion} className="quizButton">Generate a Question</button>

        <h3 className="title"> Question: </h3>

        <textarea 
    className="questionArea" 
    value={quizData && quizData.question ? quizData.question : ''} 
    readOnly 
  />
  <ul className="optionsContainer">
    {quizData && quizData.answers ? (
      quizData.answers.map((answer, index) => (
        <li key={index} className="optionItem">{answer}</li>
      ))
    ) : (
      <li className="optionItem">No options available</li>
    )}
  </ul>
  <div className={`correctAnswer ${quizData && quizData.answers && quizData.answers.length > quizData.right_answer ? 'visible' : 'hidden'}`}>
    Correct Answer
    <br/>
    {quizData && quizData.answers && quizData.answers.length > quizData.right_answer ? quizData.answers[quizData.right_answer] : ''}
  </div>

        </div>
        }

{ questionGenerationLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}


<button onClick={goBackToLobby} className="backbutton">Back to Lobby</button>
    </div>
  );
};

export default StaffQuestionGeneration;
