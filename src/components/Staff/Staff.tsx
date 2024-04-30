import React, { useState } from "react";
import "./Staff.css";

import SideBar from "../SideBar/SideBar";
import StaffBox from "../StaffBox/StaffBox";


const Staff: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [markdown, setMarkdown] = useState<string>("");
  
  const handleFileIdChange = (fileId: string) => {
    setFileId(fileId);
  };

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
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


  return (
    <div className="fullContainer">
      <SideBar file={file}/>
      <StaffBox
        file={file}
        markdown={markdown}
        fileId={fileId}
        onFileChange={handleFileChange}
        onMarkdownChange={handleMarkdownChange}
        onFileIdChange={handleFileIdChange}/>
    </div>
  );
  };


export default Staff;