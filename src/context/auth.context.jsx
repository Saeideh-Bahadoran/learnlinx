import React, { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfileURL, setUserProfileURL] = useState(null);
  const [userFirstName, setUserFirstName] = useState(null);
  const [userLastName, setUserLastName] = useState(null);
  const [isTeacher, setIsTeacherState] = useState(
    localStorage.getItem("isTeacher") === "true"
  );

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const storeProfilePictureURL = (url) => {
    setUserProfileURL(url);
  };

  const storeFirstName = (firstName) => {
    setUserFirstName(firstName);
  };

  const storeLastName = (lastName) => {
    setUserLastName(lastName);
  };

  const setIsTeacher = (booleanTeacher) => {
    console.log(booleanTeacher);
    localStorage.setItem("isTeacher", booleanTeacher);
    // Update the state variable as well
    setIsTeacherState(isTeacher);
  };

  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      try {
        const response = await fetch(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
          method: "GET",
        });

        if (!response.ok) throw new Error("Network response was not ok.");

        const user = await response.json();
        setIsLoggedIn(true);
        setIsLoading(false);
        setUser(user);
        setIsTeacherState(user.isTeacher);
        localStorage.setItem("isTeacher", user.isTeacher);
      } catch (error) {
        console.error("Error during authentication:", error);
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    removeToken();
    authenticateUser();
  };

  useEffect(() => {
    const storedIsTeacher = localStorage.getItem("isTeacher");
    if (storedIsTeacher !== null) {
      setIsTeacherState(storedIsTeacher === "true"); // Convert string to boolean
    }
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        userProfileURL,
        userFirstName,
        userLastName,
        storeToken,
        storeProfilePictureURL,
        storeFirstName,
        storeLastName,
        authenticateUser,
        logOutUser,
        currentUser,
        setCurrentUser,
        isTeacher,
        setIsTeacher,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
