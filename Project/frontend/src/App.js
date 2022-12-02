import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import React from "react";
import { Spacer } from "./components";
import { ToastContainer } from "react-toastify";
import NavbarMain from "./features/NavbarMain";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div id="app">
      <BrowserRouter>
        <div id="app-router">
          <NavbarMain />
          <Routes>
            <Route exact path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
          </Routes>
          <ToastContainer position="top-center" autoClose={1000} />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
