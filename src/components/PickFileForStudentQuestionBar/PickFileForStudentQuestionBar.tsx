import { useEffect, useState } from "react";
import { APP_API_URL, FILENAME_TO_FILEID, LOAD_FILES, LOAD_QUIZ_NAMES_API} from '../../common/consts/ApiPaths';
import Modal from "../Modal/Modal";
import { marked } from 'marked';
import './PickFileForStudentQuestionBar.css';


interface SideBarProps {
    fileClicked: boolean;
    onFileIdChange: (newFileId: string) => void;
    onFileNameChange?: (newFileId: string) => void;
    onFileUploaded?: (fileUploaded: boolean) => void;
    fileUploaded?: boolean;
  }

  interface FileNameIdDic {
    [key: string]: string;
  }

const PickFileForStudentQuestionBar: React.FC<SideBarProps> = ({fileClicked, onFileIdChange, onFileNameChange, onFileUploaded, fileUploaded}) => {
    const [filesDetails, setFilesDetails] = useState<FileNameIdDic>({});
    const [selectedFile, setSelectedFile] = useState<string | null>(null);



    useEffect(() => {
        const fetchFiles = async () => {
          try {
            const response = await fetch(`${APP_API_URL}/${FILENAME_TO_FILEID}`);
            const filesData: FileNameIdDic = await response.json();
            console.log("what")
            console.log(filesData)
            setFilesDetails(filesData)
          } catch (error) {
            console.error('Failed to fetch files:', error);
          }
        };
      
        fetchFiles();
      }, [fileClicked]);


    const handleFileSelect = (filename: string) => {
        setSelectedFile(filename)
        console.log(filesDetails[filename])
        onFileIdChange(filesDetails[filename])
        
        if (onFileUploaded) {onFileUploaded(false)}
        if (onFileNameChange !== undefined) {onFileNameChange(filename)}
    };


    return (      
    <div className="sideBarContainer">
      <h2 className="sideBarBasic">Choose a file for asking a question</h2>

      {Object.keys(filesDetails).map((fileName) => (
        <button 
          key={fileName} 
          onClick={() => handleFileSelect(fileName)}
          className={fileUploaded ? 'filesForQuestionAsking' : `filesForQuestionAsking ${selectedFile === fileName ? 'selected' : ''}`}
        >
          {fileName}
        </button>
      ))}
        
    </div>)
    }

    export default PickFileForStudentQuestionBar