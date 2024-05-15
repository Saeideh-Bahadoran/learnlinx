import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { AuthProviderWrapper } from "./context/auth.context"; // <== IMPORT
import { CourseProviderWrapper } from "./context/course.context.jsx";
import { EventProviderWrapper } from "./context/event.context.jsx";
import "@mantine/notifications/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider>
      <Notifications position="bottom-right" zIndex={1000} />
      <Router>
        <AuthProviderWrapper>
          <CourseProviderWrapper>
            <EventProviderWrapper>
              <App />
            </EventProviderWrapper>
          </CourseProviderWrapper>
        </AuthProviderWrapper>
      </Router>
    </MantineProvider>
  </React.StrictMode>
);
