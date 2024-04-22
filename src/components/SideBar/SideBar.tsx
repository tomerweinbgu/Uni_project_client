import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APP_API_URL, LOAD_QUIZ_NAMES_API} from '../../common/consts/ApiPaths';
import Modal from "../Modal/Modal";
import { marked } from 'marked';


interface SideBarProps {
    file: File | null;
    markdown: string;
  }

const SideBar: React.FC<SideBarProps> = ({file, markdown}) => {
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);



    useEffect(() => {
        const fetchFiles = async () => {
          try {
            const response = await fetch(`${APP_API_URL}/${LOAD_QUIZ_NAMES_API}`);
            const fetchedFileNames = await response.json();
            setFileNames(fetchedFileNames);
    
          } catch (error) {
            console.error('Failed to fetch files:', error);
          }
        };
      
        fetchFiles();
      }, []);

    const toggleModal = () => setShowModal(!showModal);

    const renderMarkdown = (markdownText: string) => {
        return marked.parse(markdownText);
      };


    return (      
    <div className="sideBar">
        Sidebar
    
        {fileNames.map(fileName => (
        <Link
            key={fileName}
            to={`/quiz/${fileName}/1`} 
            className="quiz-link" 
        >
            {fileName}
        </Link>
        ))}
        
        <button onClick={toggleModal} className="modalButton">{file?.name}</button>
        
        <Modal isOpen={showModal} onClose={toggleModal}>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) as unknown as string }} />
        </Modal>
    </div>)
    }

    export default SideBar