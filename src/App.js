import "./App.css";
import { Welcome } from "./components/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Homepage } from "./components/Homepage";
import { ResetPwd } from "./components/ResetPwd";
import { Agreement } from "./components/Agreement";
import { Politika } from "./components/Politika";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/buyeverywhere" element={<Welcome />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/reset" element={<ResetPwd />} />
          <Route path="/agreement" element={<Agreement />} />
          <Route path="/politika-konfidentsialnosti" element={<Politika />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
