import React, { useState } from 'react';

// This will need to change so that the user and creator are correct
const currentUser = 'user123';
const postCreator = 'user321';

function LikeButton({ creator }) {
  // Use a single state to manage the hearted users and infer the "hearted" status from it.
  const [heartedUsers, setHeartedUsers] = useState([]);
  
  const hearted = heartedUsers.includes(currentUser);

  const handleClick = () => {
    setHeartedUsers(prev => {
      // Check if the current user is already in the array.
      if (prev.includes(currentUser)) {
        // If so, filter them out (un-heart).
        return prev.filter(user => user !== currentUser);
      } else {
        return [...prev, currentUser];
      }
    });
  };

  const isCreator = currentUser === creator;

  return (
    <div>
      <button onClick={handleClick}>
        {hearted ? '❤️ Hearted' : '♡ Heart'} ({heartedUsers.length})
      </button>

      {isCreator && (
        <div style={{ marginTop: '10px' }}>
          <strong>Users who hearted this:</strong>
          <ul>
            {heartedUsers.map(user => (
              <li key={user}>{user}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Usage
export default function App() {
  return <LikeButton creator={postCreator} />;
}
