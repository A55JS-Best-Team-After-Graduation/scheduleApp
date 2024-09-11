import React, { useState, useEffect, useContext, ChangeEvent, MouseEvent } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { fetchUserDetails, verifyToken, putUserDetails } from '../service/service';

interface UpdateUserProps {
  showFeedback: (message: string, type: 'info' | 'success' | 'error') => void;
}

interface User {
  id: string;
  username: string;
  email: string;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ showFeedback }) => {
  const { id } = useParams<{ id: string }>();
  const { user: contextUser } = useContext(AppContext) as { user: User | null };
  const [localUser, setLocalUser] = useState<User>({ id: '', username: '', email: '' });
  const [initialUser, setInitialUser] = useState<User>({ id: '', username: '', email: '' });

  useEffect(() => {
    const handleUpdateUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token available');
        return;
      }

      try {
        const isValid = await verifyToken(token);
        if (isValid) {
          if (contextUser && contextUser.id === id) {
            // Use user data from context if available
            setLocalUser(contextUser);
            setInitialUser(contextUser);
          } else {
            // Fetch user details if not available in context
            const userData = await fetchUserDetails(token);
            if (userData.id === id) {
              setLocalUser(userData);
              setInitialUser(userData);
            }
          }
        } else {
          console.error('Token is invalid or expired');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    handleUpdateUser();
  }, [id, contextUser]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!id) {
      console.error('User ID is not available');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token available');
      return;
    }
    
    // Check if there are any changes
    if (JSON.stringify(localUser) === JSON.stringify(initialUser)) {
      console.log('No changes detected');
      showFeedback('No changes detected', 'info');
      return;
    }

    try {
      const isValid = await verifyToken(token);
      if (isValid) {
        // Pass the user object with the ID to putUserDetails
        await putUserDetails({ ...localUser, id }, token);
        console.log('User updated successfully');
        showFeedback('User updated successfully', 'info');
        // Update initialUser to reflect the latest changes
        setInitialUser(localUser);
      } else {
        console.error('Token is invalid or expired');
      }
    } catch (error) {
      // Handle `error` as an `Error` object
      const errorMessage = (error as Error).message || 'Error updating user.';
      console.error('Error updating user:', errorMessage);
      showFeedback(errorMessage, 'error');
    }
  };

  return (
    <div className="form-container">
      <h2>Update User</h2>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          value={localUser.username}
          placeholder="Enter your new username"
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={localUser.email}
          placeholder="Enter your new email"
          onChange={handleChange}
        />
      </div>
      <button onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
};

export default UpdateUser;
