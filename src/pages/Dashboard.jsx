import CurrentCourses from "../components/CurrentCourses";
import { useState, useEffect } from "react";
import UpcomingCourses from "../components/UpcomingCourses";
// import DailyIframe from "@daily-co/daily-js";
// import BrowserUnsupported from "../components/BrowserUnsupported/BrowserUnsupported";
// import VideoCall from "../components/VideoCall/VideoCall";
import { DailyProvider, useCallObject } from "@daily-co/daily-react";
import SmallCalendarComponent from "../components/SmallCalendarComponent";
import EventTable from "../components/EventTable";
import { Container, SimpleGrid, Title, Flex } from "@mantine/core";
import classes from "../styles/Dashboard.module.css";
const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  return (
    <>
      <div className={classes.dashboardBackground} />
      <Title ta={"left"} order={2} m={"24px"}>
        Dashboard
      </Title>
      {/* <h3>Current courses</h3> */}
      {/* <CurrentCourses /> */}
      {/* <br /> */}
      {/* DailyIframe.supportedBrowser().supported ? <VideoCall /> :
      <BrowserUnsupported /> */}
      {/* <br /> */}
      {/* <h3>Upcoming courses:</h3> */}
      {/* <UpcomingCourses /> */}

      <SimpleGrid cols={{ sm: 1, lg: 2 }} spacing="96px" verticalSpacing="72px">
        <div>
          <Title bg={"violet"} c={"white"} order={3} mb={"24px"}>
            Current Courses
          </Title>
          <CurrentCourses />
        </div>

        <Flex direction={"column"} align={"center"}>
          <Title w={"100%"} bg={"violet"} c={"white"} order={3} mb={"24px"}>
            Calendar
          </Title>
          <SmallCalendarComponent />
        </Flex>
        <div>
          <Title bg={"violet"} c={"white"} order={3} mb={"24px"}>
            Upcoming Courses
          </Title>
          <UpcomingCourses />
        </div>
        <div>
          <Title bg={"violet"} c={"white"} order={3} mb={"24px"}>
            Upcoming Events
          </Title>
          <EventTable />
        </div>
      </SimpleGrid>
    </>
  );
};

export default Dashboard;
