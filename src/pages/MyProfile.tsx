

import React, { useState } from 'react';
import { useEvents } from '../context/EventsContext';
import EventItem from '../components/EventItem';
import { Eye, EyeOff } from 'lucide-react';

// Helper to test multiple possible user id fields safely
const collectUserIds = (user: any): string[] => {
  if (!user) return [];
  const ids = [user.id, user.bearId, user.username, user.email]
    .filter(Boolean)
    .map(String);
  return Array.from(new Set(ids));
};

const hasRsvpForUser = (ev: any, userIds: string[]) => {
  if (userIds.length === 0) return false;

  // Check rsvpedBy array first (new format)
  if (Array.isArray(ev?.rsvpedBy)) {
    return ev.rsvpedBy.map(String).some((id: string) => userIds.includes(id));
  }

  // Fallback to rsvps array if it's an array (old format)
  if (Array.isArray(ev?.rsvps)) {
    return ev.rsvps.map(String).some((id: string) => userIds.includes(id));
  }

  // Fallback to userRsvped flag (legacy)
  return ev?.userRsvped === true;
};

const hasLikedEvent = (ev: any, userIds: string[]) => {
  if (userIds.length === 0) return false;

  // Check likedBy array first (new format)
  if (Array.isArray(ev?.likedBy)) {
    return ev.likedBy.map(String).some((id: string) => userIds.includes(id));
  }

  // Fallback to userLiked flag (legacy)
  return ev?.userLiked === true;
};

const isCreatedByUser = (ev: any, userIds: string[]) => {
  const creatorIds = [ev?.creatorId, ev?.createdBy, ev?.creator?.id]
    .filter(Boolean)
    .map(String);
  return creatorIds.some((id) => userIds.includes(id));
};

const Section: React.FC<{ title: string; events: any[] }> = ({ title, events }) => (
  <section className="max-w-5xl mx-auto mb-10">
    <h2 className="text-xl font-semibold mb-3">{title}</h2>
    {events.length === 0 ? (
      <p className="text-sm text-gray-500">None yet.</p>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => (
          <EventItem key={ev.id} event={ev} />
        ))}
      </div>
    )}
  </section>
);

const MyProfile: React.FC = () => {
  const { currentUser, setCurrentUser, events } = useEvents();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [devMode, setDevMode] = useState(true); // Toggle for development mode

  // Form states
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Development mode: Enable mock user for testing
  const enableDevMode = () => {
    const mockUser = {
      id: '12345',
      name: 'Test User',
      username: 'testuser',
      email: 'test@bears.unco.edu',
      accountType: 'Student'
    };
    setCurrentUser(mockUser);
    setDevMode(true);
  };

  const disableDevMode = () => {
    setCurrentUser(null);
    setDevMode(false);
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">My profile</h1>
        <p className="text-gray-600 mb-4">Please sign in to view your profile.</p>

        {/* Development Mode Button */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Development Mode</h3>
          <p className="text-sm text-yellow-700 mb-3">
            Enable development mode to test the profile page with a mock user (no login required).
          </p>
          <button
            onClick={enableDevMode}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Enable Test User
          </button>
        </div>
      </div>
    );
  }

  const userIds = collectUserIds(currentUser);

  const createdEvents = events.filter((ev: any) => isCreatedByUser(ev, userIds));
  const rsvpedEvents = events
    .filter((ev: any) => hasRsvpForUser(ev, userIds))
    // avoid duplicates when the user both created and RSVP'd
    .filter((ev: any) => !isCreatedByUser(ev, userIds));

  // Filter liked events - using user-specific function
  const likedEvents = events.filter((ev: any) => hasLikedEvent(ev, userIds));

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/accounts/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountID: currentUser.id,
          username: newUsername || undefined,
          email: newEmail || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Profile updated successfully!');
        setIsEditingProfile(false);
        setNewUsername('');
        setNewEmail('');
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
      console.error('Update profile error:', error);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  // Password validation function
  const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('One number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('One symbol (!@#$...)');
    }

    return { valid: errors.length === 0, errors };
  };

  // Check if password meets all requirements
  const passwordValidation = validatePassword(newPassword);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password requirements
    if (!passwordValidation.valid) {
      setMessage(`Password must include: ${passwordValidation.errors.join(', ')}`);
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const requestBody = {
        accountID: currentUser.id,
        currentPassword: currentPassword,
        newPassword: newPassword,
      };

      console.log('Sending password change request:', {
        accountID: requestBody.accountID,
        currentPasswordLength: currentPassword.length,
        newPasswordLength: newPassword.length
      });

      const response = await fetch('/api/accounts/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Password change response:', { status: response.status, data });

      if (response.ok && data.success) {
        setMessage('Password changed successfully!');
        setIsChangingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Reset password visibility
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      } else {
        // Backend returns 'detail' field for errors
        setMessage(data.detail || data.message || 'Failed to change password');
      }
    } catch (error) {
      setMessage('Error changing password. Please try again.');
      console.error('Change password error:', error);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Development Mode Banner */}
      {devMode && (
        <div className="mb-6 p-3 bg-yellow-100 border border-yellow-300 rounded-lg flex justify-between items-center">
          <div>
            <span className="font-semibold text-yellow-800">Development Mode Active</span>
            <span className="text-sm text-yellow-700 ml-2">(Using mock user data)</span>
          </div>
          <button
            onClick={disableDevMode}
            className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
          >
            Exit Dev Mode
          </button>
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600 mt-1">
          {currentUser?.name || currentUser?.username || currentUser?.email}
        </p>
      </header>

      {/* Success/Error Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('success')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Account Details Section */}
      <section className="max-w-5xl mx-auto mb-10 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Account Details</h2>
          {!isEditingProfile && !isChangingPassword && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {!isEditingProfile && !isChangingPassword ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Username</label>
                <p className="text-lg">{currentUser?.username || currentUser?.name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg">{currentUser?.email || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Account ID</label>
                <p className="text-lg">{currentUser?.id || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Account Type</label>
                <p className="text-lg">{currentUser?.accountType || 'User'}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setIsChangingPassword(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        ) : isEditingProfile ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder={currentUser?.username || currentUser?.name || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={currentUser?.email || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  setNewUsername('');
                  setNewEmail('');
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Requirements Indicator */}
              {newPassword && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="font-medium text-gray-700 mb-2">Password Requirements:</p>
                  <ul className="space-y-1">
                    <li className={newPassword.length >= 8 ? 'text-green-600' : 'text-red-600'}>
                      {newPassword.length >= 8 ? '✓' : '✗'} At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-red-600'}>
                      {/[A-Z]/.test(newPassword) ? '✓' : '✗'} One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-red-600'}>
                      {/[a-z]/.test(newPassword) ? '✓' : '✗'} One lowercase letter
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-red-600'}>
                      {/[0-9]/.test(newPassword) ? '✓' : '✗'} One number
                    </li>
                    <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? 'text-green-600' : 'text-red-600'}>
                      {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? '✓' : '✗'} One symbol (!@#$...)
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Events Sections */}
      <Section title="Events I Created" events={createdEvents} />
      <Section title="Events I RSVP'd To" events={rsvpedEvents} />
      <Section title="Events I Liked" events={likedEvents} />
    </div>
  );
};

export default MyProfile;