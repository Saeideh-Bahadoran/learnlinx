import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";
import { Button } from "@mantine/core";
import CustomDropzone from "../components/CustomDropzone.jsx";
import { IconEdit, IconX, IconCheck } from "@tabler/icons-react"; // Import the necessary icons
const API_URL = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null); // State to track which field is being edited
  const [tempValue, setTempValue] = useState(""); // State to temporarily store edited value

  const { userId } = useParams();
  console.log(userId);
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isLoggedIn) return;
      const storedToken = localStorage.getItem("authToken");
      try {
        const response = await fetch(`${API_URL}/api/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCurrentUser(data);
      } catch (e) {
        setError(`Failed to fetch user details: ${e.message}`);
        console.error(e);
      }
    };

    fetchUserDetails();
  }, [isLoggedIn, userId]); // Add userId to the dependencies to re-fetch user details when userId changes

  const handleEditField = (fieldName) => {
    setEditingField(fieldName); // Set the editingField state to the clicked field name
    setTempValue(currentUser[fieldName]); // Store the current value of the field in tempValue
  };

  const handleInputChange = (e) => {
    setTempValue(e.target.value); // Update the temporary value as the user types
  };

  const handleRevertChanges = () => {
    setEditingField(null); // Reset editingField state to exit editing mode
    setTempValue(""); // Reset tempValue state
  };

  const handleSaveChanges = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentUser,
          [editingField]: tempValue, // Update the corresponding field with the new value
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If the PUT request is successful, update the currentUser state
      setCurrentUser({
        ...currentUser,
        [editingField]: tempValue,
      });
      setEditingField(null); // Reset editingField state after saving changes
      setTempValue(""); // Reset tempValue state
    } catch (error) {
      console.error("Error updating user:", error);
      setError(`Failed to update user: ${error.message}`);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {currentUser && (
        <div className="profile-page">
          <h1>
            {currentUser.isTeacher ? "Teacher Profile" : "Student Profile"}
          </h1>
          <div>
            <h2>
              First Name:{" "}
              {editingField === "firstName" ? (
                <>
                  <input
                    type="text"
                    value={tempValue}
                    onChange={handleInputChange}
                  />
                  <IconX strokeWidth={1} onClick={handleRevertChanges} />{" "}
                  <IconCheck strokeWidth={1} onClick={handleSaveChanges} />
                </>
              ) : (
                <span>
                  {currentUser.firstName}
                  <IconEdit
                    strokeWidth={0.5}
                    onClick={() => handleEditField("firstName")}
                  />
                </span>
              )}
            </h2>
            <h2>
              Last Name:{" "}
              {editingField === "lastName" ? (
                <>
                  <input
                    type="text"
                    value={tempValue}
                    onChange={handleInputChange}
                  />
                  <IconX strokeWidth={1} onClick={handleRevertChanges} />{" "}
                  <IconCheck strokeWidth={1} onClick={handleSaveChanges} />
                </>
              ) : (
                <span>
                  {currentUser.lastName}
                  <IconEdit
                    strokeWidth={0.5}
                    onClick={() => handleEditField("lastName")}
                  />
                </span>
              )}
            </h2>
            <h2>
              Email Address:{" "}
              {editingField === "email" ? (
                <>
                  <input
                    type="email"
                    value={tempValue}
                    onChange={handleInputChange}
                  />
                  <IconX strokeWidth={1} onClick={handleRevertChanges} />{" "}
                  <IconCheck strokeWidth={1} onClick={handleSaveChanges} />
                </>
              ) : (
                <span>
                  {currentUser.email}
                  <IconEdit
                    strokeWidth={0.5}
                    onClick={() => handleEditField("email")}
                  />
                </span>
              )}
            </h2>
            <h2>
              Phone Number:{" "}
              {editingField === "phoneNumber" ? (
                <>
                  <input
                    type="tel"
                    value={tempValue}
                    onChange={handleInputChange}
                  />
                  <IconX strokeWidth={1} onClick={handleRevertChanges} />{" "}
                  <IconCheck strokeWidth={1} onClick={handleSaveChanges} />
                </>
              ) : (
                <span>
                  {currentUser.phoneNumber}
                  <IconEdit
                    strokeWidth={0.5}
                    onClick={() => handleEditField("phoneNumber")}
                  />
                </span>
              )}
            </h2>{" "}
            <img
              src={currentUser.profilePictureUrl}
              style={{
                width: "300px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "50%",
                overflow: "hidden",
              }}
              alt="Profile Picture"
            />
          </div>
          <CustomDropzone />
        </div>
      )}
    </>
  );
};

export default ProfilePage;
