import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { EventsProvider } from './context/EventsContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';



const App: React.FC = () => {
  return (
    <AuthProvider>
      <EventsProvider>
        <Navbar />
        <Routes>
          <Route path="" element={<Navigate to="/" replace />} />
        </Routes>
      </EventsProvider>
    </AuthProvider>
  );
};

export default App;