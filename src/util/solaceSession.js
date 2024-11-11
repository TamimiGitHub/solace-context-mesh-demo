import React, { createContext, useState } from 'react';

// Create the context object to hold the Solace Session
export const SessionContext = createContext();

// Create a Provider component to wrap the app and provide the context values
export const SolaceSession = ({ children }) => {
  const [session, setSession] = useState(null);
  const [sessionProperties, setSessionProperties] = useState({});
  const [allChat, setallChat] = useState([]);
  const [response, setResponse] = useState(null);
  // const [allChat, setallChat] = useState(sampleChat);

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        sessionProperties,
        setSessionProperties,
        allChat,
        setallChat,
        response,
        setResponse,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
