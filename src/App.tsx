import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Staff from "./components/Staff/Staff";
import Lobby from "./components/Lobby/Lobby";
import Student from "./components/Student/Student";
import QuizArchive from "./components/QuizArchive/QuizArchive";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/student" element={<Student />} />
          <Route path="/quiz/:typeOfUser/:quizName/:questionNumber" element={<QuizArchive />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
