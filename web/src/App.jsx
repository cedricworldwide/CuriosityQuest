import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import TopicDetail from './components/TopicDetail.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { TranslationProvider } from './contexts/TranslationContext.jsx';

/**
 * ProtectRoute ensures that only authenticated users can access a
 * particular route. If the user is not logged in they are
 * redirected to the login page.
 */
function ProtectRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/**
 * The root component wraps the app in both the AuthProvider and
 * TranslationProvider so that authentication and translation state
 * are available throughout the component tree. We include a
 * persistent Navbar and define client-side routes for each page.
 */
export default function App() {
  return (
    <AuthProvider>
      <TranslationProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/topic/:id" element={<TopicDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="bg-gray-100 text-center py-4 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Curiosity Quest
          </footer>
        </div>
      </TranslationProvider>
    </AuthProvider>
  );
}