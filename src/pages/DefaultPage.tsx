import React from 'react';
import { Link } from 'react-router-dom';
import bearLogo from '../assets/images/bearlogo.png';

const DefaultPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light">
      <img src={bearLogo} alt="Bear logo" className="h-24 w-24 mb-6" />
      <h1 className="text-3xl font-bold text-brand-blue mb-2">Welcome to the Bear Browser</h1>
      <p className="text-brand-bluegrey mb-6">Sign in or create an account to view events.</p>
      <div className="flex gap-4">
        <Link to="/login" className="px-4 py-2 bg-brand-blue text-brand-blue rounded hover:bg-brand-blue/80">
          Sign In
        </Link>
        <Link to="/manage" className="px-4 py-2 bg-brand-gold text-brand-blue rounded hover:bg-brand-gold/80">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default DefaultPage;