import "./App.css";
import "./styles/global.css";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  SignIn,
  SignUp,
  Navbar,
  Header,
  CalendarPage,
  ProfilePage,
  IsPrivate,
  IsPublic,
  Dashboard,
  DetailedCoursePage,
  MyCoursesPage,
  StudentsList,
  VideoCallPage,
  NotFound,
  ForgotPassword,
} from "./pages";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useContext } from "react";
import { AuthContext } from "./context/auth.context";
import CreateNewCourse from "./components/CreateNewCourse";

function App() {
  const [opened, { toggle }] = useDisclosure();
  const { user } = useContext(AuthContext); // Assumes context provides user state

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={
          user
            ? {
                width: 200,
                breakpoint: "md",
                collapsed: { mobile: !opened },
              }
            : undefined
        } // Conditionally set navbar property
      >
        <AppShell.Header style={{ backgroundColor: "rgb(242, 242, 242)" }}>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Header />
        </AppShell.Header>

        {user && (
          <AppShell.Navbar>
            <Navbar />
          </AppShell.Navbar>
        )}

        <AppShell.Main>
          <Routes>
            <Route
              path="/"
              element={
                <IsPublic>
                  <Home />
                </IsPublic>
              }
            />
            <Route
              path="/main"
              element={
                <IsPrivate>
                  <Dashboard />
                </IsPrivate>
              }
            />
            <Route
              path="/signin"
              element={
                <IsPublic>
                  <SignIn />
                </IsPublic>
              }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/forgotpassword"
              element={
                <IsPublic>
                  <ForgotPassword />
                </IsPublic>
              }
            />
            <Route
              path="/courses"
              element={
                <IsPrivate>
                  <MyCoursesPage />
                </IsPrivate>
              }
            />
            <Route
              path="/calendar"
              element={
                <IsPrivate>
                  <CalendarPage />
                </IsPrivate>
              }
            />
            <Route
              path="/students"
              element={
                <IsPrivate>
                  <StudentsList />
                </IsPrivate>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <IsPrivate>
                  <ProfilePage />
                </IsPrivate>
              }
            />
            <Route
              path="/courses/:courseId"
              element={
                <IsPrivate>
                  <DetailedCoursePage />
                </IsPrivate>
              }
            />
            <Route
              path="/video-call/:courseId"
              element={
                <IsPrivate>
                  <VideoCallPage />
                </IsPrivate>
              }
            />
            <Route
              path="/create-new-course"
              element={
                <IsPrivate>
                  <CreateNewCourse />
                </IsPrivate>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
export default App;
