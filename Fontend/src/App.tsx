import { ReactNode, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import LoginPagePhase1 from './components/LoginPage/loginPage.tsx'
import Dashboard from './components/Dashboard/Dashboard.tsx';
interface ProtectedRouteProps {
  children: ReactNode;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const userId = sessionStorage.getItem("userId");
    return userId ? <>{children}</> : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
      <Route path="/" element={<LoginPagePhase1 setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/dashboard" element={
          <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
