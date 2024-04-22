import React, { useState } from "react";
import "./Staff.css";
import { useNavigate } from "react-router-dom";

import AmericanQuestion from "../AmericanQuestion/AmericanQuestion";
import { QuizData} from './../../common/interfaces/QuizData';
import { APP_API_URL, GENERATE_QUESTION_API, SAVE_FILE_API, UPLOAD_FILE} from '../../common/consts/ApiPaths';
import SideBar from "../SideBar/SideBar";
import StaffBox from "../StaffBox/StaffBox";


const Staff: React.FC = () => {
  const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [markdown, setMarkdown] = useState<string>("");






  return (
    <div className="fullContainer">
      <SideBar file={file} markdown={markdown}/>
      <StaffBox/>
    </div>
  );
};


export default Staff;