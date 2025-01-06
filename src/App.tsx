import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import About from './components/home/About';
import Features from './components/home/Features';
import ChatWidget from './components/chat/ChatWidget';
import Footer from './components/layout/Footer';

import RoomsPage from './pages/RoomsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import NoticesPage from './pages/NoticesPage';
import PaymentPage from './pages/PaymentPage';

function App() {
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
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/notices" element={<NoticesPage />} />
              <Route path="/payment" element={<PaymentPage />} />
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
