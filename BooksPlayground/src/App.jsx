import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import CustomEntry from './pages/CustomEntry';
import ReviewForm from './pages/ReviewForm';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BookProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scanner />} />
          <Route path="/add-manual" element={<CustomEntry />} />
          <Route path="/review" element={<ReviewForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </BookProvider>
  );
}
