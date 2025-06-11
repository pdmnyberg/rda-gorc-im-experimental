import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Home from "./pages/Home/Home.tsx";
import { Documentation } from "./pages/Documentation/Documentation.tsx";

export const App = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="documentation" element={<Documentation />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
};
