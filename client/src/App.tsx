import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Auth from "./components/Auth";
import PrivateRoutes from "./PrivateRoutes/PrivateRoutes";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route element={<PrivateRoutes route="/" />}>
          <Route path="/kanban" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
