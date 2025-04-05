import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReadingListProvider } from './context/ReadingListContext';
import { useState, useEffect } from 'react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import { BookProvider } from './context/BookContext';

import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import BookSearch from './pages/Books/BookSearch';
import BookDetail from './pages/Books/BookDetail';
import Profile from './pages/Profile/Profile';
import CreateReadingList from './pages/ReadingLists/CreateReadingList';
import ReadingListDetail from './pages/ReadingLists/ReadingListDetail';
import ReadingLists from './pages/ReadingLists/ReadingLists';

import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ReadingListProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/books/search" element={<BookSearch />} />
                <Route path="/books/:id" element={<BookDetail />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reading-lists" 
                  element={
                    <ProtectedRoute>
                      <ReadingLists />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reading-lists/:id" 
                  element={
                    <ProtectedRoute>
                      <ReadingListDetail />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer position="bottom-right" />
        </ReadingListProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
