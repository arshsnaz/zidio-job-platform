import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Essential imports only - start simple
import SimpleMainPage from './pages/SimpleMainPage';

const WorkingApp = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SimpleMainPage />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
};

export default WorkingApp;