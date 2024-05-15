import { useContext, useRef, useState } from "react";
import {
  Text,
  Group,
  Button,
  useMantineTheme,
  Notification,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import {
  IconPhotoEdit,
  IconX,
  IconDownload,
  IconAlertCircle,
} from "@tabler/icons-react";
import classes from "../styles/DropzoneButton.module.css";
import { AuthContext } from "../context/auth.context";
import { courseContext } from "../context/course.context";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function CustomDropzone({ modalType }) {
  const theme = useMantineTheme();
  const openRef = useRef(null);
  const [error, setError] = useState("");

  const { storeProfilePictureURL, currentUser, setCurrentUser, user } =
    useContext(AuthContext);

  const { course, setCourse, setOldPictureURL, setNewPictureURL } =
    useContext(courseContext);

  const handleDrop = async (file) => {
    const formData = new FormData();
    formData.append("imageUrl", file[0]);
    try {
      const storedToken = localStorage.getItem("authToken");

      if (modalType == "user") {
        const updateResponse = await axios.put(
          `${API_URL}/api/users/${user.data.userId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const newImageUrl = updateResponse.data.profilePictureUrl;

        setCurrentUser({
          ...currentUser,
          profilePictureUrl: newImageUrl,
        });
        storeProfilePictureURL(newImageUrl);
      } else if (modalType == "course") {
        const updateResponse = await axios.put(
          `${API_URL}/api/courses/${course._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const newImageUrl = updateResponse.data.coursePictureUrl;

        setOldPictureURL(course.coursePictureUrl);
        setNewPictureURL(newImageUrl);
        setCourse({ ...course, coursePictureUrl: newImageUrl });
      }
    } catch (error) {
      setError(
        "Error uploading photo: " + error.response.data.message ||
          "Unexpected error occurred"
      );
    }
  };

  return (
    <div className={classes.wrapper}>
      {error && (
        <Notification
          icon={<IconAlertCircle size={18} />}
          color="red"
          onClose={() => setError("")}
          title="Upload Failed"
        >
          {error}
        </Notification>
      )}

      <Dropzone
        maxFiles={1}
        multiple={false}
        openRef={openRef}
        onDrop={handleDrop}
        className={classes.dropzone}
        radius="md"
        accept={["image/jpeg", "image/png"]}
        maxSize={30 * 1024 ** 2}
      >
        <div style={{ pointerEvents: "none" }}>
          <Group justify="center">
            <Dropzone.Accept>
              <IconDownload
                style={{ width: 50, height: 50 }}
                color={theme.colors.blue[6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: 50, height: 50 }}
                color={theme.colors.red[6]}
                stroke={1.5}
              />
            </Dropzone.Reject>
          </Group>
        </div>
      </Dropzone>

      <IconPhotoEdit
        strokeWidth={0.5}
        onClick={() => openRef.current && openRef.current()}
      />
    </div>
  );
}

export default CustomDropzone;
