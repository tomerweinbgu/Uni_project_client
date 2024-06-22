import { useEffect, useState } from "react";
import { APP_API_URL, FILENAME_TO_FILEID} from '../../common/consts/ApiPaths';
import './PickFileForStudentQuestionBar.css';

const ALL_FILES = "All files"

interface SideBarProps {
    fileClicked: boolean;
    onFileIdChange: (newFileId: string) => void;
    typeOfUser: string;
    onFileNameChange?: (newFileId: string) => void;
    onFileUploaded?: (fileUploaded: boolean) => void;
    fileUploaded?: boolean;
  }

  interface FileNameIdDic {
    [key: string]: string;
  }

const PickFileForStudentQuestionBar: React.FC<SideBarProps> = ({fileClicked, onFileIdChange, typeOfUser, onFileNameChange, onFileUploaded, fileUploaded}) => {
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
      if (filename === ALL_FILES) {
        onFileIdChange("0")
        setSelectedFile(filename)


      } 
      else{
        setSelectedFile(filename)
        onFileIdChange(filesDetails[filename])
      }
      

        if (onFileUploaded) {onFileUploaded(false)}
        if (onFileNameChange !== undefined) {onFileNameChange(filename)}
    };

    console.log(filesDetails)


    return (      
    <div className="sideBarContainer">
      <h2 className="sideBarBasic">Choose a file for asking a question</h2>
      
      { typeOfUser === "student" &&
      <>
        <button 
        onClick={() => handleFileSelect(ALL_FILES)}
        className={fileUploaded ? 'allFilesButton' : `allFilesButton ${selectedFile === ALL_FILES ? 'selected' : ''}`}
        >
        {ALL_FILES}
        </button>
        <br />
      </>
      } 

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