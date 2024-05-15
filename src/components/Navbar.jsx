import { useState } from "react";

import {
  IconCalendarClock,
  IconSchool,
  IconBrandZoom,
  IconLayoutDashboard,
  IconFriends,
} from "@tabler/icons-react";

import { AuthContext } from "../context/auth.context";
import { useContext } from "react";

import { NavLink } from "react-router-dom";
import classes from "../styles/NavbarSimpleColored.module.css";

const data = [
  { link: "/main", label: "Dashboard", icon: IconLayoutDashboard },
  { link: "/courses", label: "Courses", icon: IconSchool },
  { link: "/calendar", label: "Calendar", icon: IconCalendarClock },
];

const dataTeacher = { link: "/students", label: "Students", icon: IconFriends };
export function Navbar() {
  const [active, setActive] = useState("Dashboard");

  const { isTeacher } = useContext(AuthContext);

  const filteredData = isTeacher ? [...data, dataTeacher] : data;

  const links = filteredData.map((item) => (
    <NavLink
      className={classes.link}
      // activeClassName={classes.active}
      to={item.link}
      key={item.label}
      onClick={() => setActive(item.label)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      {/* Use Switch and Route for rendering components based on route */}
    </nav>
  );
}

export default Navbar;
