import { User } from '../types';

const API_BASE = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

export const userService = {
  // Get all users from server
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE}/users`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  },

  // Find user by username and password
  findUser: async (username: string, password: string): Promise<User | null> => {
    try {
      const users = await userService.getUsers();
      return users.find(user => 
        user.username === username && (user as any).password === password
      ) || null;
    } catch (error) {
      console.error('Failed to find user:', error);
      return null;
    }
  },

  // Add new user to server
  addUser: async (user: User & { password: string }): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      
      if (response.ok) {
        return true;
      } else {
        const error = await response.json();
        console.error('Server error:', error.error);
        return false;
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      return false;
    }
  },

  // Check if username exists
  usernameExists: async (username: string): Promise<boolean> => {
    try {
      const users = await userService.getUsers();
      return users.some(user => user.username === username);
    } catch (error) {
      console.error('Failed to check username:', error);
      return false;
    }
  }
};