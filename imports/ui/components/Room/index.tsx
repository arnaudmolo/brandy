import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ColorLensIcon from '@material-ui/icons/ColorLens';
import EditIcon from '@material-ui/icons/Edit';

import Player from '../../models/Player';
import { usePlayer } from '../../AuthProvider';
import Deck from '../Deck';
import CardType from '../../models/Card';

import Board from '../Board';
import Hand from '../Hand';
import Popup from 'reactjs-popup';

import './styles.css';
import Cemetery from '../Cemetery';

import { Rooms } from '/imports/api/rooms';
import Players from '/imports/api/players';
import { last, init, slice, head, nth, curry, chain, zipObj, map, take, tail, mathMod, __, range } from 'ramda';
import { start, paths, allPath, end } from '../Board/points';
import { Snackbar, Button } from '@material-ui/core';

import MuiAlert from '@material-ui/lab/Alert';

const circle = mathMod(__, 96);

const objFromListWith = curry((fn, list) => chain(zipObj, map(fn))(list))
const objFromPosition = objFromListWith(p => p.position);

const COLORS = [
  'black',
  'blue',
  'green',
  'white',
  'yellow',
  'red',
];
const FIRSTS = [0, 16, 32, 48, 64, 80];
const SIMPLE_CARDS = [2, 3, 5, 6, 8, 9, 10, 12];

type RoomType = {
  readonly _id: number;
  readonly round: number;
  readonly identifiant: String;
  readonly players: Player[];
  readonly gamemaster: Player;
  readonly started: boolean;
  readonly deck: CardType[];
  readonly cemetery: CardType[];
  readonly gifts: string[];
  readonly pawns: {
    readonly position: number;
    readonly color: string;
    readonly moved: true;
  }[];
}

const TEAMS = [['black', 'white'], ['blue', 'yellow'], ['red', 'green']];

const findTeamateByColor = (players: Player[], player: Player) => {
  if (!player.color) {
    return undefined;
  }
  const nbTeam = TEAMS.findIndex(team => team.includes(player.color));
  return players.find(p => p._id !== player._id && TEAMS.findIndex(t => t.includes(p.color)) === nbTeam);
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Room: React.SFC<{}> = () => {
  const {player, loading, changeName} = usePlayer();
  const params: {id?: string} = useParams();
  const playerId = player && player._id;

  const room: RoomType = useTracker(() => {
    const room = Rooms.findOne({identifiant: params.id});
    window.doIt = () => {
      Rooms.reshuffle(room._id, room.players);
    }
    return room;
  }, [params.id]);

  const rotativeColors = useMemo(() => {
    let c: string[] = [...COLORS];
    if (room?.round) {
      for (let index = 0; index < room.round; index++) {
        c = [last(c), ...init(c)];
      }
    }
    return c;
  }, [room?.round]);

  const players: Player[] = useTracker(() => {
    if (room && room.players.length >= 1) {
      const requete = Players.find({
        _id: {
          $in: room.players
        }
      });
      return requete.fetch().sort((a: Player, b: Player) => {
        const colorOrder = rotativeColors.indexOf(b.color) - rotativeColors.indexOf(a.color);
        if (b.hand && a.hand) {
          if (b.hand.length === a.hand.length) {
            return colorOrder;
          }
          return b.hand.length - a.hand.length;
        } else {
          return colorOrder;
        }
      });
    }
    return [];
  }, [room && room.players]);

  const waitForGift: Player[] = useMemo(() => room && players && players.filter(player => room.gifts.includes(player._id)), [players, room]);
  
  const hasToGift = room && player && room.gifts.includes(player._id);

  useEffect(() => {
    if (room && player && !room.players.includes(player._id)) {
      Rooms.join(room._id, player._id);
    }
  }, [room?._id, player?._id]);

  const updatePawns = useCallback((from: number, to: number) => {
    Rooms.movePawn(room._id, from, to);
  }, [room]);

  const [editName, setEditName] = useState(false);
  const onNameDoubleClick = useCallback(() => setEditName(state => !state), []);
  const validateOnEnter = useCallback(event => {
    if (event.key === 'Enter') {
      changeName(event.target.value);
      setEditName(false);
    }
  }, [changeName]);

  const [notification, setNotification] = useState<string>(null);

  const drawCards = useCallback(async (nb) => {
    if (players.some(player => !player.color)) {
      return console.log('nooooon');
    }
    console.log(players.map(player => player.hand))
    players.forEach(player => {
      player.hand.forEach(card => Players.play(card));
    });
    setTimeout(() => Rooms.draw(room._id, nb), 100);
  }, [room, players]);

  const onPlayCard = useCallback((card: CardType) => {
    if (waitForGift && waitForGift.length) {
      return setNotification(`waiting for: ${waitForGift.reduce((otherNames, player) => `${otherNames} ${player.name}, `, '')} to send their gifts`);
    }
    const firstPlayer = players && players.length && head(players);
    if (firstPlayer._id === player._id) {
      return Players.play(card);
    } else {
      return setNotification(`It's ${firstPlayer.name} turn.`);
    }
  }, [waitForGift]);

  const onColorClick = useCallback((color) =>
    Players.update(playerId, {$set: {color}})
  , [playerId]);

  const throwCards = useCallback(() => {
    player?.hand.forEach(card => Players.play(card));
  }, [player?._id, player?.hand]);

  const teamate = useMemo(() => player && findTeamateByColor(players, player), [players, player]);

  const takenColors = players ? players.reduce(
    (colors, player) => player.color ? [...colors, player.color] : colors, []
  ) : [];

  const lastCardPlayed = room && last(room.cemetery);

  let playable: any[] = useMemo(() => {
    let response = [];
    if (player && player.color && room && room.cemetery && !hasToGift) {
      const finished: boolean = room.pawns.filter(pawn => pawn.color === player.color).every(pawn => end[player.color].some(slot => slot.position === pawn.position ));
      const pwcms: Player = finished ? teamate : player;
      if (lastCardPlayed && (lastCardPlayed?.by === player._id)) {
        const myPawns = room.pawns.filter(pawn => pawn.color === pwcms.color);
        const myStart = start[pwcms.color];
        const myEnd = end[pwcms.color];
        const myPaths = paths[pwcms.color];
        const myPawnsOnBoard = myPawns.filter(pawn => !myStart.map(({position}) => position).includes(pawn.position));
        const pawnsByPosition = objFromPosition(room.pawns);
        const pawnsOnBoard = room.pawns.filter(pawn => allPath.map(({position}) => position).includes(pawn.position));
        // const pawnsOnBoardByPosition = objFromPosition(room.pawns)
        const canaille = (positions: number[]) => {
          return (pawns, pawn) => {
            const to = positions.reduce((acc, position) => {
              let localPath = pawn.position + position < 0 ? slice(allPath.length - position, allPath.length + 1, allPath) : slice(pawn.position, circle(pawn.position + position), allPath);
              const rawPath = tail(localPath);
              const rawPathByLocation = objFromPosition(rawPath);
              // Bloque si un pion n'est pas bougé
              if (FIRSTS.some(index => {
                const res = rawPathByLocation[index] && pawnsByPosition[index] && pawnsByPosition[index] !== pawn && !pawnsByPosition[index].moved;
                return res;
              })) {
                return acc;
              }
              // Rentrer dans la niche
              if (pawn.moved) {
                // Tout les points entre le pion et la destination
                // Si le point de départ est dans le les points que le pion va traverser
                const startSlot = localPath.find(block => block.position === head(myPaths).position);
                if (startSlot) {
                  // Alors bifurque vers la niche
                  const normalPath = slice(pawn.position + 1, startSlot.position + 1, allPath);
                  const destination = nth(
                    position - 1,
                    [
                      ...normalPath,
                      ...take(position - normalPath.length, myEnd),
                    ]
                  );
                  if (destination) {
                    acc.push(destination);
                  }
                }
              }
              // Is in the niche
              if (myEnd.find(slot => slot.position === pawn.position)) {
                const fromStart = pawn.position - myEnd[0].position + 1;
                localPath = slice(fromStart, pawn.position - fromStart + position, myEnd);
                if (localPath.find(slot => pawnsByPosition[slot.position])) {
                  return acc
                }
                return [...acc, myEnd.find(slot => slot.position === pawn.position + position)];
              }
              // Is in the start
              if (pawn.position > 96) {
                return acc;
              }
              return [...acc, nth(circle(pawn.position + position), allPath)];
            }, []);
            if (to.length >= 1) {
              pawns.push({from: pawn, to});
            }
            return pawns;
          };
        }
        if (lastCardPlayed.value === 1) {
          response = myPawns.reduce((acc, pawn) => {
          // Can I draw a pawn ?
          if (pawn.position !== myPaths[0].position) {
              const isAtStart = myStart.some(slot => slot.position === pawn.position);
              if (isAtStart) {
                acc.push({
                  from: pawn,
                  to: [head(paths[player.color])]
                });
              }
            }
            return canaille([1, 11])(acc, pawn);
          }, []);
        } else if (SIMPLE_CARDS.includes(lastCardPlayed.value)) {
          response = myPawnsOnBoard.reduce(canaille([lastCardPlayed.value]), []);
        } else if (lastCardPlayed.value === 4) {
          response = myPawnsOnBoard.reduce(canaille([-4, 4]), []);
        } else if (lastCardPlayed.value === 13) {
          if (myPawns.every(pawn => pawn.position !== myPaths[0].position)) {
            response = myPawns.reduce((acc, pawn) => {
              const isAtStart = myStart.some(slot => slot.position === pawn.position);
              if (isAtStart) {
                return [
                  ...acc,
                  {
                    from: pawn,
                    to: [head(myPaths)]
                  }
                ];
              }
              return canaille([13])(acc, pawn);
            }, []);
            
          }
        } else if (lastCardPlayed.value === 11) {
          response = myPawnsOnBoard.map(pawn => {
            return {
              from: pawn,
              to: pawnsOnBoard.reduce((acc, pawn) => {
                if (pawn.moved) {
                  return [...acc, allPath[pawn.position]]
                }
                return acc;
              }, []),
            }
          });
        } else if (lastCardPlayed.value === 7) {
          response = myPawnsOnBoard.reduce(
            canaille(range(1, 7 + 1)),
            []
          );
        }
      }
    };
    return response;
  }, [lastCardPlayed?.id, teamate]);

  console.log({ playable, room, player, players });

  const colorsById = players ? players.reduce((acc, player) => {
    acc[player._id] = player.color;
    return acc;
  }, {}) : {};

  return (
    <div className="room__container">
      <Snackbar open={!!notification} autoHideDuration={6000} onClose={() => setNotification(null)}>
        <Alert onClose={() => setNotification(null)} severity="warning">
          {notification}
        </Alert>
      </Snackbar>
      <div className="room__main">
        {room && (
          <Board pawns={room.pawns} playable={ playable } setPawns={updatePawns} />
        )}
      </div>
      <aside className="room__aside">
        {room && <Cemetery colorsById={colorsById} cards={room.cemetery} />}
        {room && <Deck
          cards={ room.deck }
          onDraw={ drawCards }
          value={ 6 - mathMod(room.round, 5) }
        />}
        <div
          style={{backgroundColor: `var(--${last(rotativeColors)})`}}
        >
          <p>started</p>
        </div>
        {room && (
          <div className={'player-liste'}>
            <List dense>
              {players && players.map(listPlayer => (
                <ListItem key={listPlayer._id} className={`player-list__player player-list__player__${listPlayer.color}`}>
                  <ListItemText
                    secondary={`${listPlayer && listPlayer.hand.length} cards${room.gifts.includes(listPlayer._id) ? ' - Has to send a gift' : ''}`}
                  >
                    <div>
                      {player && listPlayer._id === player._id ? (
                        <div>
                          {editName ? (
                            <input
                              disabled={ loading }
                              onKeyDown={validateOnEnter}
                              defaultValue={player.name}
                            /> 
                          ) : listPlayer.name}
                          <EditIcon fontSize="small" onClick={ onNameDoubleClick } />
                          <Popup
                            trigger={<span onDoubleClick={onNameDoubleClick}>{<ColorLensIcon fontSize="small" />}</span>}
                          >
                            <div className="color-picker color-picker__container ">
                              {COLORS.map(color => {
                                const colorTaken = takenColors.includes(color);
                                return (
                                  <div
                                    key={color}
                                    onClick={() => !colorTaken && onColorClick(color)}
                                    className={`color-picker__color color-picker__color__${color} ${colorTaken && 'color-picker__color__disable'}`}
                                  />
                                );
                              })}
                            </div>
                          </Popup>
                        </div>
                      ) : listPlayer.name}
                    </div>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </aside>
      <footer className={`room__footer room__hand-container ${player && player.color ? `room__hand-container--${player.color}` : ''}`}>
        {room && player && player.hand && (
          <Hand
            player={ player }
            teamate={ teamate }
            hasToGift={ hasToGift }
            players={ players.filter(p => p._id !== player._id) }
            onDrawCard={ onPlayCard }
          />
        )}
        <Button onClick={ throwCards } variant="contained" color="secondary">Throw</Button>
      </footer>
    </div>
  );
}

export default Room;
