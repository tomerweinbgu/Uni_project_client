import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizData } from "../../common/interfaces/QuizData";
import { APP_API_URL, GENERATE_QUESTION_API, SAVE_FILE_API, UPLOAD_FILE } from "../../common/consts/ApiPaths";
import AmericanQuestion from "../AmericanQuestion/AmericanQuestion";
import "./StaffBox.css";


interface StaffBoxProps {
  file: File | null;
  fileId: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUploaded: (fileUploaded: boolean) => void;
  onMarkdownChange: (markdown: string) => void;
  onFileIdChange: (fileId: string) => void;
  onFileSaved: () => void;
  fileName: string;
  onFileNameChange: (fileName: string) => void;
}

const StaffBox: React.FC<StaffBoxProps> = ({file, fileId, onFileChange, onFileUploaded, onMarkdownChange, onFileIdChange, onFileSaved, fileName, onFileNameChange}) => {
    const navigate = useNavigate();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [questionGenerationLoading, setQuestionGenerationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [assistantId, setAssistantId] = useState<string>("");
  const [threadId, setThreadId] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [showSavedText, setShowSavedText] = useState<string>("");



  const fetchQuestion = async () => {
    setQuestionGenerationLoading(true);
    setError("");

    const formData = new FormData();
    console.log(fileId, "fileId")
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
      changeShownText("NoFile")
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_id', fileId);

    try {
      const response = await fetch(`${APP_API_URL}/${SAVE_FILE_API}`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      onFileSaved();
      changeShownText("Saved")

      console.log('File uploaded successfully:', result);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
        setUploadLoading(false);
    }

  }

  const goBackToLobby = () => {
    navigate("/"); 
  };

  const changeShownText = (text: string) => {
      setShowSavedText(text)
      setTimeout(() => {
        setShowSavedText("");
    }, 3000); 
  };


  const uploadFile = async () => {
    if (!file) {
      changeShownText("NoFile")
      return;
    }
    
    const text = await file.text();

    console.log("text")
    onMarkdownChange(text);

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
      onFileIdChange(result);
      const trimmedFileName = file.name.replace('.md', '');
      onFileNameChange(trimmedFileName)
      console.log('File uploaded successfully:', result);
      setFileUploaded(true);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file');
    } finally {
        setUploadLoading(false);
        onFileUploaded(true);
    }
  };
    
    return (
        <div className="quizContainer">
          <div className="inputContainer">
            <div className="saveContainer">
              {fileUploaded && <button className="saveButtonStaff" onClick={handleSaveFile}> Save </button>}
              {showSavedText === "Saved" && <p className="saveText">File saved successfully!</p>}
              {showSavedText === "NoFile" && <p className="saveText">Please select a file first!</p>}
            </div>
            <input type="file" className="fileInput" onChange={onFileChange} accept=".md" />

          </div>

          <div className="questionUploadContainer">
            {fileUploaded ? <button onClick={uploadFile} className="changeButton">Change File</button> : 
            <button onClick={uploadFile} className="uploadButton">Upload File</button>} 
          </div>

          {uploadLoading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}


          {fileName &&
            <div className="title-text">
              <h3 className="filename"> {fileName} </h3>
              <button onClick={fetchQuestion} className="uploadButton">Generate a Question</button>

              {questionGenerationLoading && <p>Loading...</p>}
              {error && <p className="error">{error}</p>}

              {quizData && fileName && <AmericanQuestion quizData={quizData} updateQuizData={setQuizData} file_name={fileName}/>}
            </div>
          }

          <button onClick={goBackToLobby} className="StaffBackButton">Back to Lobby</button>
      </div>
    )
}

export default StaffBox