import { Button, Title } from "@mantine/core";
import CurrentCourses from "../components/CurrentCourses";
import LastCourses from "../components/LastCourses";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";

const MyCoursesPage = () => {
  const navigate = useNavigate();
  const { isTeacher } = useContext(AuthContext);

  console.log(isTeacher);
  const handleClick = () => {
    navigate("/create-new-course");
  };
  return (
    <>
      <Title bg={"violet"} c={"white"} order={2} my={"30px"}>
        My Current Courses
      </Title>

      <CurrentCourses />

      <Title bg={"violet"} c={"white"} order={2} my={"24px"}>
        My Courses
      </Title>

      <LastCourses />
      {isTeacher && (
        <Button mb={"30px"} mt={"20px"} size="lg" onClick={handleClick}>
          Add a new course
        </Button>
      )}
    </>
  );
};

export default MyCoursesPage;
