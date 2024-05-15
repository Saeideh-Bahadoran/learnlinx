import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";
import { Button, Modal, Image } from "@mantine/core";
import SmallDropzone from "../components/SmallDropzone.jsx";
import { IconEdit, IconX, IconCheck } from "@tabler/icons-react";
const API_URL = import.meta.env.VITE_API_URL;
import headerblob from "../images/layered-waves-haikei.svg";
import defaultProfilePic from "../images/default-profile.png";
import "../styles/UserPage.css";
import EditProfileModal from "../components/EditProfileModal.jsx";

const ProfilePage = () => {
  const {
    isLoggedIn,
    user,
    logOutUser,
    storeFirstName,
    storeLastName,
    storeProfilePictureURL,
    userProfileURL,
    currentUser,
    setCurrentUser,
  } = useContext(AuthContext);

  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null); // State to track which field is being edited
  const [tempValue, setTempValue] = useState(""); // State to temporarily store edited value
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const { userId } = useParams();

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
  }, [isLoggedIn, userId]);

  const handleEditField = (fieldName) => {
    setEditingField(fieldName);
    setTempValue(currentUser[fieldName]);
  };

  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleRevertChanges = () => {
    setEditingField(null);
    setTempValue("");
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
          [editingField]: tempValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCurrentUser({
        ...currentUser,
        [editingField]: tempValue,
      });
      if (editingField == "firstName") {
        storeFirstName(tempValue);
      }
      if (editingField == "lastName") {
        storeLastName(tempValue);
      }

      setEditingField(null);
      setTempValue("");
    } catch (error) {
      console.error("Error updating user:", error);
      setError(`Failed to update user: ${error.message}`);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      // First confirmation
      setConfirmDelete(true);
    } else {
      // Second confirmation, proceed with deletion
      const storedToken = localStorage.getItem("authToken");
      try {
        const response = await fetch(`${API_URL}/api/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        logOutUser();
      } catch (error) {
        console.error("Error deleting user:", error);
        setError(`Failed to delete user: ${error.message}`);
      } finally {
        setDeleteModalOpened(false);
        setConfirmDelete(false); // Reset confirmation state
      }
    }
  };

  return (
    <>
      {currentUser && (
        <div className="profile-page">
          <Image src={headerblob} className="header-blob" />
          <div className="usertype">
            {currentUser.isTeacher ? "Teacher Profile" : "Student Profile"}
          </div>
          <img
            className="profile-picture"
            src={userProfileURL || defaultProfilePic}
            style={{
              objectFit: "cover",
              borderRadius: "50%",
              overflow: "hidden",
            }}
            alt="Profile Picture"
          />
          <div>
            <div className="user-name">
              {currentUser.firstName} {currentUser.lastName}{" "}
              <IconEdit
                className="user-edit-icon"
                strokeWidth={0.5}
                onClick={() => setEditModalOpened(true)}
              />
            </div>
            <div className="user-email">{currentUser.email}</div>
            <div className="user-number">
              <span style={{ fontWeight: "bold", color: "lightblue" }}>
                Phone Number:{" "}
              </span>
              {currentUser.phoneNumber}
            </div>
          </div>

          <EditProfileModal
            modalOpened={editModalOpened}
            setModalOpened={setEditModalOpened}
            currentUser={currentUser}
          />
          <div className="user-photo-edit">
            <SmallDropzone modalType={"user"} />
          </div>
          <Button
            className="delete-button"
            color="red"
            onClick={() => setDeleteModalOpened(true)}
          >
            Delete Account
          </Button>
          <Modal
            opened={deleteModalOpened}
            onClose={() => {
              setDeleteModalOpened(false);
              setConfirmDelete(false);
            }}
            title="Confirm Account Deletion"
          >
            <p>Are you sure you want to delete your account?</p>
            {confirmDelete ? (
              <p>Please confirm again to delete your account permanently.</p>
            ) : null}
            <Button color="red" onClick={handleDeleteAccount}>
              {confirmDelete ? "Confirm Delete" : "Delete Account"}
            </Button>
            <Button
              color="green"
              onClick={() => {
                setDeleteModalOpened(false);
                setConfirmDelete(false);
              }}
              style={{ marginLeft: "10px" }}
            >
              Keep my account
            </Button>
          </Modal>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
