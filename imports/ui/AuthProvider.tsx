import React, { useContext, createContext, useCallback, useMemo } from "react";

import Player from './models/Player';
import { useTracker } from "meteor/react-meteor-data";
import Players from "../api/players";

export const Context = createContext<any>(null);

type PlayerState = {
  player?: Player;
  loading: boolean;
};

interface PlayerHook extends PlayerState {
  changeName: (name: string) => Promise<any>;
  dispatch: (action: {
    type: string;
    payload: any;
  }) => any;
}

export const usePlayer: () => PlayerHook = () => useContext(Context);

const Component: React.SFC<{}> = ({children}) => {
  const player = useTracker(Players.createOrFind)

  const playerId = player && player._id;

  const changeName = useCallback(name =>
    Players.changeName(playerId, name)
  , [playerId]);

  return (
    <Context.Provider value={ useMemo(() => ({player, changeName}), [changeName, player]) }>
      {children}
    </Context.Provider>
  )
};

export default Component;
