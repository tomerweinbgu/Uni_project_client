import React, { useState } from "react";
import "./Student.css";

import "highlight.js/styles/base16/atelier-dune-light.min.css";

import SideBar from "../SideBar/SideBar";
import PickFileForStudentQuestionBar from "../PickFileForStudentQuestionBar/PickFileForStudentQuestionBar";
import StudentBox from "../StudentBox/StudentBox";



const Student: React.FC = () => {
  const [fileId, setFileId] = useState<string>("");

  const handleFileIdChanged= (newFileId: string) => {
    setFileId(newFileId);
  };

  return (
    <div className="fullContainer">
      <SideBar fileSaved={false} typeOfUser={"student"}/>
      <StudentBox fileId={fileId}/>
      <PickFileForStudentQuestionBar fileClicked={false} onFileIdChange={handleFileIdChanged}/>
    </div>
)};

export default Student;
