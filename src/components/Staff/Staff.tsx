import React, { useState } from "react";
import "./Staff.css";
import SideBar from "../SideBar/SideBar";
import StaffBox from "../StaffBox/StaffBox";


const Staff: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [fileSaved, setFileSaved] = useState<boolean>(false);
  const [markdown, setMarkdown] = useState<string>("");
  
  const handleFileIdChange = (fileId: string) => {
    setFileId(fileId);
  };

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };

  const handleFileSave = () => {
    setFileSaved(true);
  };

  const handleFileChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
    
    if (file !== null){ 
      console.log(file.name, "file_name")
    const text = await file.text();

    handleMarkdownChange(text);
    setFileUploaded(true);
    }
  };

  console.log("fileId", fileId)


  return (
    <div className="fullContainer">
      <SideBar fileSaved={fileSaved} typeOfUser={"staff"}/>
      <StaffBox
        file={file}
        fileId={fileId}
        onFileChange={handleFileChange}
        onMarkdownChange={handleMarkdownChange}
        onFileIdChange={handleFileIdChange}
        onFileSaved={handleFileSave}/>
    </div>
  );
  };


export default Staff;