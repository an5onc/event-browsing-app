import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { EventsProvider } from './context/EventsContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';

/**
 * The top level component for the event browsing application.  It
 * encapsulates all context providers and routes.  By isolating the
 * providers here we can easily add more global state in the future
 * without modifying individual pages.  A simple navigation bar
 * provides links to the main routes.

const App: React.FC = () => {
  return (
    <AuthProvider>
      <EventsProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<CreateEventPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/events/:id/edit" element={<EditEventPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </EventsProvider>
    </AuthProvider>
  );
};

export default App;
*/

/**
 
The top level component for the event browsing application.  It
encapsulates all context providers and routes.  By isolating the
providers here we can easily add more global state in the future
without modifying individual pages.  A simple navigation bar
provides links to the main routes.*/
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