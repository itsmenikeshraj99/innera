import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Dashboard from './Dashboard.jsx'; // Naya page import kiya
import Onboarding from './Onboarding.jsx'; // Naya page import kiya
import Classroom from './Classroom.jsx'; // Naya page import kiya
import MockTest from './MockTest.jsx'; // Naya page import kiya
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/classroom" element={<Classroom />} />
        <Route path="/mocktest" element={<MockTest />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);