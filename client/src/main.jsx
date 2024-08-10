import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Home from './Home.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pay" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);