import React, { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const courseContext = React.createContext();

function CourseProviderWrapper(props) {
  const [course, setCourse] = useState({});
  const [oldPictureURL, setOldPictureURL] = useState(null);
  const [newPictureURL, setNewPictureURL] = useState(null);

  return (
    <courseContext.Provider
      value={{
        course,
        setCourse,
        oldPictureURL,
        setOldPictureURL,
        newPictureURL,
        setNewPictureURL,
      }}
    >
      {props.children}
    </courseContext.Provider>
  );
}

export { CourseProviderWrapper, courseContext };
