import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import NavbarMain from "./features/NavbarMain";
import Footer from "./features/Footer";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

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
          <ToastContainer position="top-center" autoClose={2500} />
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
