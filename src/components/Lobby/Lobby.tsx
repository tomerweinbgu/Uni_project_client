import { Link } from "react-router-dom";
import "./Lobby.css";

const Lobby = () => {
  return (
    <div className="lobby-container">
      <h1 className="lobby-header">Welcome to the Lobby</h1>
      <Link to="/staff" className="link-button">
        <button className="navigation-button">Staff</button>
      </Link>
      <Link to="/student" className="link-button">
        <button className="navigation-button">Student</button>
      </Link>
    </div>
  );
};

export default Lobby;
