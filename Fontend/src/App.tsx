import { ReactNode, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import LoginPagePhase1 from './components/LoginPage/loginPage.tsx'
interface ProtectedRouteProps {
  children: ReactNode;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    return isLoggedIn ? <>{children}</> : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
      <Route path="/" element={<LoginPagePhase1 setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </Router>
  )
}

export default App
