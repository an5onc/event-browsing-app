import React, { useState } from 'react';

// Define the type for a simple user object
interface User {
  id: string;
  name: string;
}

// Mock user data for demonstration
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Smith' },
  { id: 'u2', name: 'Bob Johnson' },
  { id: 'u3', name: 'Charlie Brown' },
  { id: 'u4', name: 'Diana Prince' },
];

interface InviteUserSearchProps {
  onInvite: (user: User) => void;
  invitedUsers: User[];
}

const InviteUserSearch: React.FC<InviteUserSearchProps> = ({ onInvite, invitedUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(user => 
    !invitedUsers.some(invited => invited.id === user.id) // Filter out already invited users
  );

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">Search Users to Invite</h3>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md"
      />

      {/* Results List */}
      <div className="max-h-60 overflow-y-auto space-y-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium">{user.name}</span>
              <button 
                type="button"
                onClick={() => onInvite(user)}
                className="text-xs px-3 py-1 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition"
              >
                Invite
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No users found or all users are invited.</p>
        )}
      </div>

      {/* Invited Users List */}
      {invitedUsers.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-sm font-semibold mb-1">Invited:</p>
              <div className="flex flex-wrap gap-2">
                  {invitedUsers.map(user => (
                      <span key={user.id} className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                          {user.name}
                      </span>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default InviteUserSearch;