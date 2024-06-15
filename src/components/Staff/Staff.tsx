import React, { useState } from "react";
import "./Staff.css";
import SideBar from "../SideBar/SideBar";
import StaffBox from "../StaffBox/StaffBox";
import PickFileForStudentQuestionBar from "../PickFileForStudentQuestionBar/PickFileForStudentQuestionBar";


const Staff: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string>("");
  const [filename, setFileName] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [fileSaved, setFileSaved] = useState<boolean>(false);
  const [markdown, setMarkdown] = useState<string>("");


  
  const handleFileIdChange = (newFileId: string) => {
    setFileId(newFileId);
  };

  const handleFileNameChange = (newFileName: string) => {
    setFileName(newFileName);
  };

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };

  const handleFileSave = () => {
    setFileSaved(true);
  };

  const handleFileUploaded = (fileUploaded: boolean) => {
    setFileUploaded(fileUploaded);
  };

  const handleFileChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
    
    if (file !== null){ 
      console.log(file.name, "file_name")
    const text = await file.text();

    handleMarkdownChange(text);
    }
  };

  console.log("file123", fileUploaded)



  return (
    <div className="StaffFullContainer">
      <SideBar fileSaved={fileSaved} typeOfUser={"staff"}/>
      <StaffBox
        file={file}
        fileId={fileId}
        onFileChange={handleFileChange}
        onFileUploaded={handleFileUploaded}
        onMarkdownChange={handleMarkdownChange}
        onFileIdChange={handleFileIdChange}
        onFileSaved={handleFileSave}
        fileName={filename}
        onFileNameChange={handleFileNameChange}/>
      <PickFileForStudentQuestionBar
        fileClicked={false}
        onFileIdChange={handleFileIdChange}
        onFileNameChange={handleFileNameChange}
        onFileUploaded={handleFileUploaded}
        fileUploaded={fileUploaded}/>

    </div>
  );
  };


export default Staff;