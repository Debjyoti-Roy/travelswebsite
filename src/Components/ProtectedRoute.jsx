import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

// Component for general authentication protection
export const AuthProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        // Check if userData cookie exists
        const cookies = document.cookie.split("; ");
        const userDataCookie = cookies.find((row) =>
          row.startsWith("userData=")
        );

        if (userDataCookie) {
          const value = userDataCookie.split("=")[1];
          const userData = JSON.parse(decodeURIComponent(value));
          
          // Check if user data exists (any authenticated user)
          if (userData && userData.uid) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Component for partner-specific authorization
const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        // Check if userData cookie exists
        const cookies = document.cookie.split("; ");
        const userDataCookie = cookies.find((row) =>
          row.startsWith("userData=")
        );

        if (userDataCookie) {
          const value = userDataCookie.split("=")[1];
          const userData = JSON.parse(decodeURIComponent(value));
          
          // Check if user has partner role
          if (userData && userData.role === "PARTNER") {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 