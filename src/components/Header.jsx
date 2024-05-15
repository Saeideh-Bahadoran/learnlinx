import cx from "clsx";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { NavLink } from "react-router-dom";
import {
  Autocomplete,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Button,
  useMantineTheme,
  Flex,
} from "@mantine/core";
import {
  IconLogout,
  IconSettings,
  IconChevronDown,
  IconSearch,
} from "@tabler/icons-react";
import classes from "../styles/HeaderTabs.module.css";
import logo from "../images/learnlinx-logo.svg";
const API_URL = import.meta.env.VITE_API_URL;

export function Header() {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const {
    isLoggedIn,
    user,
    logOutUser,
    userProfileURL,
    userFirstName,
    userLastName,
    currentUser,
    setCurrentUser,
    storeFirstName,
    storeLastName,
    storeProfilePictureURL,
  } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      const storedToken = localStorage.getItem("authToken");
      const requestOptions = {
        method: "GET", // Explicitly setting the method to GET
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json", // Assuming you use Bearer token authorization
        },
      };

      fetch(`${API_URL}/api/users/${user.data.userId}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setCurrentUser(data);
          storeFirstName(data.firstName);
          storeLastName(data.lastName);
          storeProfilePictureURL(data.profilePictureUrl);
        })
        .catch((error) => console.error("Failed to load user data:", error));
    }
  }, [isLoggedIn]);

  return (
    <div className={classes.header}>
      <div className={classes.headerInner}>
        <NavLink to="/" className={classes.logoLink}>
          <img src={logo} alt="LearnLinx Logo" style={{ width: "100px" }} />
        </NavLink>

        {!isLoggedIn ? (
          <NavLink to="/signin">
            <Button>Log in</Button>
          </NavLink>
        ) : (
          currentUser && (
            <Menu
              width={260}
              position="bottom-end"
              transition="pop-top-right"
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.currentUser, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group gap={7}>
                    <Avatar
                      src={userProfileURL}
                      alt={userFirstName}
                      radius="xl"
                      size={40}
                    />
                    <Text weight={500} size="sm" mr={3}>
                      {userFirstName} {userLastName}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                {/* <Menu.Item
                    icon={<IconHeart size={16} color={theme.colors.red[6]} />}
                  >
                    Liked posts
                  </Menu.Item>
                  <Menu.Item
                    icon={<IconStar size={16} color={theme.colors.yellow[6]} />}
                  >
                    Saved posts
                  </Menu.Item>
                  <Menu.Item
                    icon={
                      <IconMessage size={16} color={theme.colors.blue[6]} />
                    }
                  >
                    Your comments
                  </Menu.Item> */}
                {/* <Menu.Label>Settings</Menu.Label> */}
                <NavLink to={`/profile/${user.data.userId}`}>
                  <Menu.Item icon={<IconSettings size={16} />}>
                    My Profile
                  </Menu.Item>
                </NavLink>
                <Menu.Item onClick={logOutUser} icon={<IconLogout size={16} />}>
                  Logout
                </Menu.Item>
                {/* <Menu.Divider />
                  <Menu.Label>Danger zone</Menu.Label>
                  <Menu.Item icon={<IconPlayerPause size={16} />}>
                    Pause subscription
                  </Menu.Item> */}
              </Menu.Dropdown>
            </Menu>
          )
        )}
      </div>

      <Container size="md">
        <Tabs
          defaultValue="Home"
          variant="outline"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          {/* Tabs go here */}
        </Tabs>
      </Container>
    </div>
  );
}

export default Header;
