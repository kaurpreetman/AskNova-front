import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import { Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import CodeGeneration from './components/CodeGeneration';
const { isAuthenticated, isLoading } = useAuth();

const ProtectedRoute = ({ isAllowed, children }) => {
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

 if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 theme-transition">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-secondary-600 dark:border-t-secondary-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Loading your experience...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Please wait while we prepare everything for you</p>
        </div>
      </div>
    );
  }
function App() {
  return (
     <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HeroSection />} />
                <Route
                  path="/generate"
                  element={
                     <ProtectedRoute isAllowed={isAuthenticated}>
                      <CodeGeneration />
                   </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
