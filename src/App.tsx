import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StaffQuestionGeneration from "./components/StaffQuestionGeneration/StaffQuestionGeneration";
import Lobby from "./components/Lobby/Lobby";
import Student from "./components/Student/Student";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/staff" element={<StaffQuestionGeneration />} />
          <Route path="/student" element={<Student />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
