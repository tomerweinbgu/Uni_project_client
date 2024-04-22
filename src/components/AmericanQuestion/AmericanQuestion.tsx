import { marked } from "marked";
import { useEffect, useState } from "react";

interface QuizData {
    question: string;
    answers: string[];
    right_answer: number;
    assistant_id: string;
    thread_id: string;
    file_name?: string;
  }
  
const AmericanQuestion: React.FC = () => {
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
    const [fileNames, setFileNames] = useState<string[]>([]);
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
          setQuizData({...quizData, question: editableQuestion});
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
          setQuizData({...quizData, answers: updatedAnswers});
          setEditingIndex(null);
        }
      };
    
      useEffect(() => {
        const fetchFiles = async () => {
          try {
            const response = await fetch('http://127.0.0.1:8000/load_quiz_names');
            const fetchedFileNames = await response.json();
            setFileNames(fetchedFileNames);
    
          } catch (error) {
            console.error('Failed to fetch files:', error);
          }
        };
      
        fetchFiles();
      }, []);
    
      // Edit questions Tomer unique component
      
    
      const handleSaveQuestion = async () => {
        if (quizData) {
          if (file) quizData.file_name = file.name 
          // console.log(file?.name)
          // console.log("hey", quizData.file_name)
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
          console.log(file.name, "file_name")
        const text = await file.text();
    
        setMarkdown(text);
        console.log("checkcheckcheck")
        console.log(text)
        setFileUploaded(true);
        }
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
    
        setUploadLoading(true);
        setError("");
        const formData = new FormData();
        formData.append('file', file, file.name);
    
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
  <div>
    <h3 className={`correctAnswerText ${quizData && quizData.answers && quizData.answers.length > quizData.right_answer ? 'visible' : 'hidden'}`}>
    Correct Answer
    </h3>
    
    <span className="correctAnswer">
    {quizData && quizData.answers && quizData.answers.length > quizData.right_answer ? quizData.answers[quizData.right_answer] : ''}
    </span>
  </div>
  </div>
    )
}

export default AmericanQuestion;