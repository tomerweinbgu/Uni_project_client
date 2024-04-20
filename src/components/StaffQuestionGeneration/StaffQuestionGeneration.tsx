import React, { useState, useEffect } from "react";
import "./StaffQuestionGeneration.css";
import { useNavigate } from "react-router-dom";
import { marked } from 'marked'; // If 'marked' is a named export

import Modal from "../Modal/Modal"; // Import Modal component

interface QuizData {
  question: string;
  answers: string[];
  right_answer: number;
  assistant_id: string;
  thread_id: string;
  file_name?: string;
}

const StaffQuestionGeneration: React.FC = () => {
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [filesName, setFilesName] = useState<string[]>([]);


  // useEffect(() => {
  //   const fetchFiles = async () => {
  //     try {
  //       const response = await fetch('http://127.0.0.1:8000/load_files');
  //       const data = await response.json();
  //       console.log(data)
  //       // setFiles(data);
  //     } catch (error) {
  //       console.error('Failed to fetch files:', error);
  //     }
  //   };

  //   fetchFiles();
  // }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/load_quiz');
        const fileNames = await response.json();  // Expecting an array of file names
        for (const filename of fileNames) {
          console.log(filename);
      }
        console.log(filesName)
        setFiles(fileNames);  // Assuming setFiles will store these names in state
      } catch (error) {
        console.error('Failed to fetch files:', error);
      }
    };
  
    fetchFiles();
  }, []);
  

  const handleFileSelect = (file: any) => {
    console.log("hey")
  };

  const handleSaveQuestion = async () => {
    if (quizData) {
      if (file) quizData.file_name = file.name 
      console.log(file?.name)
      console.log("hey", quizData.file_name)
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
      setQuizData(null);
    }
  }
};


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
      const response = await fetch('http://127.0.0.1:8000/generate_question', {
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
    console.log("hey")

    try {
      const response = await fetch('http://127.0.0.1:8000/save_file', {
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
    const text = await file.text();

    setMarkdown(text);
    console.log("checkcheckcheck")
    console.log(text)
    setFileUploaded(true);
    }
  };

  const goBackToLobby = () => {
    navigate("/"); 
  };

  const renderMarkdown = (markdownText: string) => {
    return marked.parse(markdownText);
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }
    
    const text = await file.text();

    setMarkdown(text);
    console.log("checkcheckcheck")
    console.log(text)

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

  const toggleModal = () => setShowModal(!showModal);


  return (
    <div className="fullContainer">
      <div className="sideBar">
        Sidebar

        {filesName.map((fileName, index) => (
    // <button key={index} onClick={() => handleFileSelect(fileName)}>
    <button key={index} onClick={() => handleFileSelect(fileName)}>
        {fileName}
    </button>
      ))}

        {/* {files.map(file => (
          <button key={file.name} onClick={() => handleFileSelect(file)}>
            {file.name}
          </button>
        ))} */}
        <button onClick={toggleModal} className="modalButton">{file?.name}</button>

      </div>
    <div className="quizContainer">
      <div className="inputContainer">
        <button className="saveButton" onClick={handleSaveFile}> Save </button>
        <input type="file" className="fileInput" onChange={handleFileChange} accept=".md" />
      </div>
      <div className="questionUploadContainer">
        {fileUploaded ? <button onClick={uploadFile} className="uploadButton">Change File</button> : 
        <button onClick={uploadFile} className="quizButton">Upload File</button>}


      
      </div>

      {uploadLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}



      <Modal isOpen={showModal} onClose={toggleModal}>
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) as unknown as string }} />
       </Modal>
      {/* <Modal isOpen={showModal} onClose={toggleModal}>
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedFile.content) }} />
       </Modal> */}

      {fileUploaded &&
              <div className="title-text">
        <button onClick={fetchQuestion} className="quizButton">Generate a Question</button>

        { questionGenerationLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

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
  <div>
    <h3 className={`correctAnswerText ${quizData && quizData.answers && quizData.answers.length > quizData.right_answer ? 'visible' : 'hidden'}`}>
    Correct Answer
    </h3>
    
    <span className="correctAnswer">
    {quizData && quizData.answers && quizData.answers.length > quizData.right_answer ? quizData.answers[quizData.right_answer] : ''}
    </span>
  </div>

        </div>
        }

  <button className="saveButton" onClick={handleSaveQuestion}> Save </button>




<button onClick={goBackToLobby} className="backbutton">Back to Lobby</button>
    </div>
    </div>
  );
};


export default StaffQuestionGeneration;