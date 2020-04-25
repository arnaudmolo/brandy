import React, { createContext, useContext, useMemo, useEffect } from "react";
import io from 'socket.io-client';

const BASE_URL = process.env.NODE_ENV === 'production' ? '//api.molo.cool/' : `http://${window.location.hostname}:1337/`;

export const Context = createContext(null);

export const useSocket = () => useContext(Context);

export default ({children}) => {
  const socket = useMemo(() => io(BASE_URL), []);
  // useEffect(() => {
  //   socket.on('disconnect', () => socket.connect());
  // });
  return (
    <Context.Provider value={socket}>
      {children}
    </Context.Provider>
  )
};
