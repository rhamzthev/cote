import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '../config';

interface FileContent {
  filename: string;
  content: string;
  starred: boolean;
}

// This should match the user profile information you get from Google
export interface GoogleUser {
  sub: string; // The unique user ID
  name: string;
  email: string;
  picture: string;
}

type FetchWithTokenRefresh = (path: string, options?: RequestInit) => Promise<Response>;
type RefreshAccessToken = () => Promise<void>;

export const useGoogleDrive = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(null);

  // Declare refreshAccessToken first since it's used by fetchWithTokenRefresh
  const refreshAccessToken = useCallback<RefreshAccessToken>(async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Important: this ensures cookies are sent
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      setIsAuthorized(true);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setIsAuthorized(false);
      setCurrentUser(null);
    }
  }, []);

  // Helper function to handle API calls with token refresh
  const fetchWithTokenRefresh = useCallback<FetchWithTokenRefresh>(async (path: string, options: RequestInit = {}) => {
    const url = `${API_CONFIG.baseUrl}${path}`;
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include'
      });

      // If unauthorized, try to refresh token and retry
      if (response.status === 401) {
        await refreshAccessToken();
        // Retry the original request
        return fetch(url, {
          ...options,
          credentials: 'include'
        });
      }

      return response;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }, [refreshAccessToken]);

  useEffect(() => {
    // Check auth status and get user info from server
    const checkAuthStatus = async () => {
      try {
        const response = await fetchWithTokenRefresh('/api/auth/status');
        
        if (response.ok) {
          const user = await response.json();
          setIsAuthorized(true);
          setCurrentUser(user);
        } else {
          setIsAuthorized(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
        setIsAuthorized(false);
        setCurrentUser(null);
      }
    };

    checkAuthStatus();
  }, [fetchWithTokenRefresh]);

  const initiateAuth = async (options?: { loginHint?: string }) => {
    try {
      // Get the current path and search parameters
      const { pathname, search } = window.location;
      
      // Default to root if not available
      let returnUrl = pathname || '/';
      
      // If we're on the file page, include the search params (state parameter)
      if (pathname === '/file' && search) {
        returnUrl = `${pathname}${search}`;
      }
      
      let authUrl = `${API_CONFIG.baseUrl}/auth/google/url?returnUrl=${encodeURIComponent(returnUrl)}`;
      
      if (options?.loginHint) {
        authUrl += `&login_hint=${encodeURIComponent(options.loginHint)}`;
      }

      const response = await fetch(authUrl);
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to initiate auth:', error);
    }
  };

  const getFile = async (id: string): Promise<FileContent> => {
    try {
      const response = await fetchWithTokenRefresh(`/api/drive/files/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch file');
      }

      const data = await response.json();
      return {
        filename: data.filename,
        content: data.content,
        starred: data.starred
      };
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  };

  const updateFilename = async (fileId: string, newFilename: string) => {
    try {
      const response = await fetchWithTokenRefresh(
        `/api/drive/files/${fileId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filename: newFilename }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update filename");
      }

      const data = await response.json();
      return { id: data.id, name: data.name };
    } catch (error) {
      console.error("Error updating filename:", error);
      throw error;
    }
  };

  const getFileStarStatus = async (fileId: string): Promise<boolean> => {
    try {
      const response = await fetchWithTokenRefresh(
        `/api/drive/files/${fileId}/star`
      );

      if (!response.ok) {
        throw new Error("Failed to get file star status");
      }

      const data = await response.json();
      return data.starred;
    } catch (error) {
      console.error("Error getting file star status:", error);
      throw error;
    }
  };

  const toggleFileStar = async (fileId: string, starred: boolean): Promise<boolean> => {
    try {
      const response = await fetchWithTokenRefresh(
        `/api/drive/files/${fileId}/star`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ starred }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle file star status");
      }

      const data = await response.json();
      return data.starred;
    } catch (error) {
      console.error("Error toggling file star status:", error);
      throw error;
    }
  };

  const updateFileContent = async (fileId: string, newContent: string): Promise<{ id: string; name: string; mimeType: string }> => {
    try {
      // If content is too large, we'll need to handle it differently
      if (newContent.length > 10 * 1024 * 1024) { // 10MB limit
        throw new Error("File content is too large. Please try with a smaller file.");
      }

      const response = await fetchWithTokenRefresh(
        `/api/drive/files/${fileId}/content`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newContent }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update file content");
      }

      const data = await response.json();
      return {
        id: data.id,
        name: data.name,
        mimeType: data.mimeType
      };
    } catch (error) {
      console.error("Error updating file content:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetchWithTokenRefresh('/api/auth/logout', { method: 'POST' });
    } finally {
      setIsAuthorized(false);
      setCurrentUser(null);
    }
  };

  return {
    isAuthorized,
    currentUser,
    initiateAuth,
    logout,
    getFile,
    updateFilename,
    toggleFileStar,
    updateFileContent,
    getFileStarStatus,
  };
};