import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APP_API_URL, LOAD_FILES, LOAD_QUIZ_NAMES_API} from '../../common/consts/ApiPaths';
import Modal from "../Modal/Modal";
import { marked } from 'marked';
import './SideBar.css';


interface SideBarProps {
    file: File | null;
  }

interface FileDetail {
  name: string;
  content: string;
}

const SideBar: React.FC<SideBarProps> = ({file}) => {
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [filesDetails, setFilesDetails] = useState<FileDetail[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileDetail | null>(null);



    useEffect(() => {
        const fetchFiles = async () => {
          try {
            const response = await fetch(`${APP_API_URL}/${LOAD_QUIZ_NAMES_API}`);
            const fetchedFileNames = await response.json();
            setFileNames(fetchedFileNames);
    
          } catch (error) {
            console.error('Failed to fetch files:', error);
          }

          try {
            const response = await fetch(`${APP_API_URL}/${LOAD_FILES}`);
            const filesData: FileDetail[] = await response.json();
            setFilesDetails(filesData);
          } catch (error) {
            console.error('Failed to fetch files:', error);
          }
        };
      
        fetchFiles();
      }, [file]);

    // const toggleModal = () => setShowModal(!showModal);

    const renderMarkdown = (markdownText: string) => {
        return marked.parse(markdownText);
      };

    const handleFileSelect = (file: FileDetail) => {
      setSelectedFile(file);
      setShowModal(true);
    };


    return (      
    <div className="sideBarContainer">
      <h2 className="sideBarBasic">Sidebar</h2>

      <h3 className="sideBarTitles">Files</h3>
      {filesDetails.map(file => (
        <button 
          key={file.name} 
          onClick={() => handleFileSelect(file)}
          className="modalButton"
        >
          {file.name}
        </button>
      ))}
      
      {selectedFile && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div 
            dangerouslySetInnerHTML={{ 
              __html: renderMarkdown(selectedFile.content) as unknown as string
            }} 
          />
        </Modal>
      )}

      <h3 className="sideBarTitles">Quizes</h3>
        {fileNames.map(fileName => (
        <Link
            key={fileName}
            to={`/quiz/${fileName}/1`} 
            className="quizButton" 
        >
            {fileName}
        </Link>
        ))}
        
        {/* <button onClick={toggleModal} className="modalButton">{file?.name}</button>
        
        <Modal isOpen={showModal} onClose={toggleModal}>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) as unknown as string }} />
        </Modal> */}
    </div>)
    }

    export default SideBar