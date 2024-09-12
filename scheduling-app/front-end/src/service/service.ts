interface User {
    id: string;
    username: string;
    email: string;
    // Add more fields as needed, but do not include password
  }
  
  interface UserResponse {
    id: string;
    username: string;
    email: string;
    token: string;
  }
  
  interface ValidationError {
    message: string;
  }
  
  interface MessageResponse {
    id: string;
    content: string;
    // Add more fields as needed
  }
  
  export const registerUser = async (user: { username: string; password: string; email: string }): Promise<User> => {
    try {
      const response = await fetch(`/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        const message = errorText || `Failed to register (status: ${response.status})`;
        throw new Error(message);
      }
  
      return await response.json();
    } catch (error) {
        console.error("Error in registerUser:", (error as Error).message || error);
      throw error;
    }
  };
  
  export const loginUser = async (credentials: { email: string; password: string }): Promise<UserResponse> => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to login (status: ${response.status})`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error in loginUser:', (error as Error).message || error);
      throw error;
    }
  };
  
  export const validateForm = (form: { username?: string; email?: string; password?: string }): string => {
    const { username, email, password } = form;
  
    if (!username || !email || !password) {
      return "All fields are required";
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }
  
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
  
    return ""; // Return empty string if no errors
  };
  
  export const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/users/verify-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        console.error("Failed to verify token (status:", response.status, ")");
        return false;
      }
  
      const data = await response.json();
      return data.valid;
    } catch (error) {
      console.error("Token verification failed:", (error as Error).message || error);
      return false;
    }
  };
  
  export const fetchUserDetails = async (token: string): Promise<User> => {
    try {
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const message = `Failed to fetch user details (status: ${response.status})`;
        throw new Error(message);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching user details:", (error as Error).message || error);
      throw error;
    }
  };
  
  export const putUserDetails = async (user: User, token: string): Promise<User> => {
    try {
      const response = await fetch(`/api/users/update/${user.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating user: ${response.statusText}`);
      }
  
      console.log('User updated:', user);
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', (error as Error).message);
      throw error;
    }
  };
  
  export const validateMessage = (message: string): boolean => {
    return message.trim() !== '';
  };
  
  export const fetchMessages = async (roomName: string, page: number, showFeedback: (message: string, type: string) => void): Promise<MessageResponse[] | void> => {
    try {
      const response = await fetch(`/api/users/rooms/${roomName}/messages?page=${page}&limit=20`);
  
      if (!response.ok) {
        console.error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
        showFeedback(`Error: Failed to fetch messages (${response.status})`, 'error');
        return;
      }
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Received non-JSON response');
        showFeedback('Error: Received invalid response format', 'error');
        return; 
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      showFeedback('Error: Failed to fetch messages', 'error');
      return;
    }
  };
  
  const deleteMessageById = async (msgId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/messages/${msgId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  
  const editMessageById = async (msgId: string, newMessage: string): Promise<void> => {
    try {
      if (newMessage.trim()) {
        const response = await fetch(`/api/messages/${msgId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: newMessage }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };
  