import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import KanbanBoard from "./components/KanbanBoard";
import Login from "./components/Login";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/kanban" element={<KanbanBoard />} />
      </Routes>
    </Router>
  );
};

export default App;
