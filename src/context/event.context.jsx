import React, { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const EventContext = React.createContext();

function EventProviderWrapper(props) {
  const [event, setEvent] = useState({});

  return (
    <EventContext.Provider
      value={{
        event,
        setEvent,
      }}
    >
      {props.children}
    </EventContext.Provider>
  );
}

export { EventProviderWrapper, EventContext };
