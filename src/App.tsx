import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';

// pages
import HomePage from './pages/HomePage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import EventDetailPage from './pages/EventDetailPage';
import Help from './components/help';
import CreateAccountPage from './pages/CreateAccountPage';
import CalendarPage from './pages/CalendarPage';
import MyProfile from './pages/MyProfile';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateEventPage />} />
        <Route path="/manage" element={<CreateAccountPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/events/:id/edit" element={<EditEventPage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;