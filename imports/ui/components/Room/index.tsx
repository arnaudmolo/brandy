import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

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

import { useTracker } from 'meteor/react-meteor-data';
import { Rooms } from '/imports/api/rooms';
import Players from '/imports/api/players';

const COLORS = [
  'black',
  'blue',
  'green',
  'white',
  'yellow',
  'red',
];

type RoomType = {
  readonly _id: number;
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
  }[]
}


const TEAMS = [['black', 'white'], ['blue', 'yellow'], ['red', 'green']];

const findTeamateByColor = (players: Player[], player: Player) => {
  if (!player.color) {
    return null;
  }
  const nbTeam = TEAMS.findIndex(team => team.includes(player.color));
  return players.find(p => p._id !== player._id && TEAMS.findIndex(t => t.includes(p.color)) === nbTeam);
}

const Room: React.SFC<{}> = () => {
  const {player, loading, changeName} = usePlayer();
  const params: {id?: string} = useParams();
  const playerId = player && player._id;

  const room: RoomType = useTracker(() => {
    const room = Rooms.findOne({identifiant: params.id});
    console.log(room);
    return room;
  }, [params.id])

  const players: Player[] = useTracker(() => {
    if (room && room.players.length >= 1) {
      const requete = Players.find({
        _id: {
          $in: room.players
        }
      });
      return requete.fetch();
    }
    return [];
  }, [room && room.players]);

  console.log({player});

  useEffect(() => {
    if (room && player && !room.players.includes(player._id)) {
      Rooms.join(room._id, playerId);
    }
  }, [room, player]);

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

  const drawCards = useCallback(async (nb) =>
    Rooms.draw(room._id, nb)
  , [room]);

  const onPlayCard = useCallback((card: CardType) => {
    console.log('onPlayCard', card);
    Players.play(card);
    // axios.put(`/rooms/${room.id}`, {
    //   cards: {
    //     deck: room.cards.deck,
    //     cemetery: [...room.cards.cemetery, card]
    //   }
    // });
    // axios.put(`/players/${player._id}`, {
    //   cards: {
    //     ...player.cards,
    //     hand: player.cards.hand.filter(c => c.id !== card.id),
    //   }
    // });
  }, [room, player]);

  const onColorClick = useCallback((color) =>
    Players.update(playerId, {$set: {color}})
  , [playerId]);

  const teamate = useMemo(() => player && findTeamateByColor(players, player), [players, player]);

  const takenColors = players ? players.reduce(
    (colors, player) => player.color ? [...colors, player.color] : colors, []
  ) : [];

  return (
    <div className="room__container">
      <div className="room__main">
        {room && (
          <Board pawns={room.pawns} setPawns={updatePawns} />
        )}
      </div>
      <aside className="room__aside">
        {room && <Cemetery cards={room.cemetery} />}
        {room && <Deck
          cards={ room.deck }
          onDraw={ drawCards }
        />}
        {room && (
          <div className={'player-liste'}>
            <List dense>
              {players && players.sort((a: Player, b: Player) => {
                if (b.hand && a.hand) {
                  return b.hand.length - a.hand.length
                } else {
                  return 0
                }
              }).map(listPlayer => (
                <ListItem key={listPlayer._id} className={`player-list__player player-list__player__${listPlayer.color}`}>
                  <ListItemText
                    secondary={`${listPlayer && listPlayer.hand.length} cards`}
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
      <footer className="room__footer room__hand-container">
        {room && player && player.hand && (
          <Hand
            player={ player }
            teamate={ teamate }
            hasToGift={room.gifts.includes(player._id)}
            players={players.filter(p => p._id !== player._id)}
            onDrawCard={onPlayCard}
          />
        )}
      </footer>
    </div>
  );
}

export default Room;
