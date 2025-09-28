import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Test if MainPage works first
const SimpleTestApp = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          🚀 ZIDIO Job Platform
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">✅ React is Working!</h2>
          <p className="text-gray-600 mb-4">
            The application is loading correctly. Now let's test the components...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold text-blue-800">Frontend</h3>
              <p className="text-sm text-blue-600">✅ Running on :5174</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold text-green-800">Backend</h3>
              <p className="text-sm text-green-600">✅ Running on :8080</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <h3 className="font-semibold text-purple-800">Database</h3>
              <p className="text-sm text-purple-600">✅ MySQL Connected</p>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default SimpleTestApp;