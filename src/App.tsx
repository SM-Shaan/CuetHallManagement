import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import About from './components/home/About';
import Features from './components/home/Features';
import ChatWidget from './components/chat/ChatWidget';
import Footer from './components/layout/Footer';
import ManagerDashboard from './pages/ManagerDashboard';
import RoomsPage from './pages/RoomsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import NoticesPage from './pages/NoticesPage';
import PaymentPage from './pages/PaymentPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AddHall from '../Checker/AddHall';
import {jwtDecode} from 'jwt-decode';

function App() {
  const Token = localStorage.getItem('token');
  const [isUserActive, setIsUserActive] = useState(false);

  const handleUserActivity = (isActive: boolean,role:string) => {
    fetch(`https://localhost:7057/Login/UserActivity/${isActive}/${role}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify({ activity: isActive }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 401) {
            window.location.href = '/login';
            alert(`Unauthorized: Login First`);
            return;
          }
          if (response.status === 400) {
            window.location.href = '/';
            alert(`${errorMessage}`);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        //console.log('User activity detected:', data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  useEffect(() => {
    if (Token) {
      const decodedToken: { role: string } = jwtDecode(Token);
        console.log('User is a student');
        
        const handleActivity = () => {
          setIsUserActive(true);
        };

        document.addEventListener('mousemove', handleActivity);
        document.addEventListener('keydown', handleActivity);

        const intervalId = setInterval(() => {
          if (isUserActive) {
            handleUserActivity(true,decodedToken.role);
            setIsUserActive(false); // Reset the activity flag
          } else {
            handleUserActivity(false,decodedToken.role);
          }
        }, 60000); // Check every 1 minute

        return () => {
          document.removeEventListener('mousemove', handleActivity);
          document.removeEventListener('keydown', handleActivity);
          clearInterval(intervalId);
        };
      
    }
  }, [Token, isUserActive]);

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-100 via-indigo-50 to-pink-100 animate-gradient-blur" />

        <div className="relative z-10 flex flex-col min-h-screen text-gray-800">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <About />
                    <Features />
                  </>
                }
              />
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/notices" element={<NoticesPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/add-hall" element={<AddHall />} />
            </Routes>
          </main>
          <ChatWidget />
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;