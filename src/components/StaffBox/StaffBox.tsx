import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizData } from "../../common/interfaces/QuizData";
import { APP_API_URL, GENERATE_QUESTION_API, SAVE_FILE_API, UPLOAD_FILE } from "../../common/consts/ApiPaths";
import AmericanQuestion from "../AmericanQuestion/AmericanQuestion";

const StaffBox: React.FC = () => {
    const navigate = useNavigate();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [questionGenerationLoading, setQuestionGenerationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fileId, setFileId] = useState<string>("");
  const [assistantId, setAssistantId] = useState<string>("");
  const [threadId, setThreadId] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [markdown, setMarkdown] = useState<string>("");



  const fetchQuestion = async () => {
    setQuestionGenerationLoading(true);
    setError("");

    const formData = new FormData();
    formData.append('file_id', fileId);
    if (threadId) formData.append('thread_id', threadId);
    if (assistantId) formData.append('assistant_id', assistantId);
    console.log(threadId, "threadId")
    console.log(assistantId, "assistantId")

    try {
      const response = await fetch(`${APP_API_URL}/${GENERATE_QUESTION_API}`, {
        method: 'POST',
        body: formData,
      });;

      const data: QuizData = await response.json();
      setQuizData(data);
      setAssistantId(data.assistant_id)
      setThreadId(data.thread_id)
      console.log('Question fetched successfully:', data);
    } catch (error) {
      console.error('Failed to fetch question:', error);
      setError('Failed to fetch question');
      setQuizData(null);
    } finally {
        setQuestionGenerationLoading(false);
    }
  };

  const handleSaveFile = async() => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${APP_API_URL}/${SAVE_FILE_API}`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      console.log('File uploaded successfully:', result);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
        setUploadLoading(false);
    }

  }

  const handleFileChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
    
    if (file !== null){ 
      console.log(file.name, "file_name")
    const text = await file.text();

    setMarkdown(text);
    setFileUploaded(true);
    }
  };

  const goBackToLobby = () => {
    navigate("/"); 
  };


  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }
    
    const text = await file.text();

    setMarkdown(text);

    setUploadLoading(true);
    setError("");
    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
      const response = await fetch(`${APP_API_URL}/${UPLOAD_FILE}`, {
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
        <div className="inputContainer">
          <button className="saveButton" onClick={handleSaveFile}> Save </button>
          <input type="file" className="fileInput" onChange={handleFileChange} accept=".md" />
        </div>

        <div className="questionUploadContainer">
          {fileUploaded ? <button onClick={uploadFile} className="changeButton">Change File</button> : 
          <button onClick={uploadFile} className="uploadButton">Upload File</button>} 
        </div>

        {uploadLoading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}


        {fileUploaded &&
          <div className="title-text">
            <button onClick={fetchQuestion} className="uploadButton">Generate a Question</button>

            {questionGenerationLoading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {quizData && file?.name && <AmericanQuestion quizData={quizData} updateQuizData={setQuizData} file_name={file.name}/>}
          </div>
        }

        <button onClick={goBackToLobby} className="backbutton">Back to Lobby</button>
      </div>
    )
}

export default StaffBox