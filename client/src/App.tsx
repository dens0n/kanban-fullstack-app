import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Auth from "./components/Auth";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/kanban" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
